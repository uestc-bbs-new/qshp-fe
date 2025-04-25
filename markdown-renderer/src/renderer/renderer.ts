import DOMPurify from 'dompurify'

import { html, htmlspecialchars } from '../utils/html'
import siteRoot from '../utils/siteRoot'
import { transformLegacyLinks, transformLink } from '../utils/transform'
import { unifiedSmilyMap } from './smilyData'
import { Attachment, VditorContext } from './types'

type RenderState = {
  type: 'image' | 'link'
  text?: string
  dest?: string
}

export const kSmilyBasePath = siteRoot + '/static/image/smiley/'

export const renderAttachmentImage = (
  attach: Attachment,
  extraAttributes?: string
) => {
  const src = attach.thumbnail_url
    ? attach.thumbnail_url
    : siteRoot + attach.path
  let fullSizePath = siteRoot + attach.path
  let rawUrl = attach.raw_url
  // TODO: Remove this after backend correctly return paths.
  if (attach.thumbnail_url) {
    if (!rawUrl) {
      rawUrl = fullSizePath
    }
    fullSizePath = attach.thumbnail_url + '?variant=original'
  }
  let img = html`<img
    src="${src}"
    data-x-filename="${attach.filename}"
    data-x-fullsize-path="${fullSizePath}"
    class="post_attachment post_attachment_image"
    loading="lazy"`
  if (rawUrl) {
    img += ` data-x-raw-path="${htmlspecialchars(rawUrl)}"`
  }
  if (extraAttributes) {
    img += ` ${extraAttributes}`
  }
  return `${img}/>`
}

export const renderAttachMedia = (attach: Attachment) => {
  if (!attach.download_url) {
    return ''
  }
  if (attach.filename.match(/\.(mp4|flv)$/i)) {
    return html`<div>
      <video
        class="post_attachment_video"
        controls
        src="${attach.download_url}"
      ></video>
    </div>`
  }
  if (attach.filename.match(/\.mp3$/i)) {
    return html`<audio
      class="post_attachment_audio"
      controls
      src="${attach.download_url}"
    ></audio>`
  }
  return ''
}

const renderImage = (src: string, alt: string, context?: VditorContext) => {
  if (src == 's' && unifiedSmilyMap[parseInt(alt || '')]) {
    return html`<img
      src="${kSmilyBasePath}${unifiedSmilyMap[parseInt(alt || '')]}"
      class="post_smily"
      data-x-special-kind="smily"
      data-x-original-src="${src}"
      data-x-original-alt="${alt}"
    />`
  }
  const match = src.match(/^(?:i|a):([0-9]+)$/)
  if (match) {
    const id = parseInt(match[1])
    const attachment = context?.attachments?.find(
      (item) => item.attachment_id == id
    )
    if (attachment) {
      context?.inlineAttachments?.add(attachment.attachment_id)
      return renderAttachmentImage(
        attachment,
        html`alt="${alt}" data-x-special-kind="attachment"
        data-x-original-src="${src}" data-x-original-alt="${alt}"`
      )
    }
  }
  return html`<img src="${src}" alt="${alt || ''}" />`
}
const renderLink = (
  href: string,
  text: string,
  rendererType: string,
  context?: VditorContext
) => {
  const atMatch = href.match(/^at:(\d+)$/)
  if (atMatch) {
    return html`<a
      class="post_at_user"
      href="/user/${atMatch[1]}"
      data-x-original-href="${href}"
      >${text}</a
    >`
  }
  const attachMatch = href.match(/^a:(\d+)$/)
  if (attachMatch) {
    const id = parseInt(attachMatch[1])
    const attach = context?.attachments?.find(
      (item) => item.attachment_id == id
    )
    if (attach) {
      context?.inlineAttachments?.add(attach.attachment_id)
      let result = html`<a
        class="post_attachment post_attachment_file"
        href="${attach.download_url || 'javascript:void(0)'}"
        download="${attach.filename}"
        data-x-special-kind="attachment"
        data-x-original-src="${href}"
        data-x-original-alt="${text}"
        >${text}</a
      >`
      if (rendererType == 'Preview') {
        result += renderAttachMedia(attach)
      }
      return result
    }
  }
  return html`<a href="${href}">${text}</a>`
}

type LuteRenderResult = [string, number]

const shouldRenderMarkers = (
  nodeType: string,
  rendererType: string,
  node: ILuteNode,
  entering: boolean
): LuteRenderResult | false => {
  if (
    nodeType == 'image' &&
    (rendererType == 'SpinVditorIRDOM' || rendererType == 'Md2VditorIRDOM')
  ) {
    return [
      entering
        ? `<span class="vditor-ir__node vditor-ir__node--expand" data-type="img">`
        : `</span>`,
      Lute.WalkContinue,
    ]
  }
  // See also lute/render/vditor_{ir,sv}_renderer.go for reference implementation.
  // `node.Parent.LinkType == 3` is not implemented yet.
  if (
    ['SpinVditorSVDOM', 'SpinVditorIRDOM', 'Md2VditorIRDOM'].includes(
      rendererType
    ) &&
    entering
  ) {
    const mode =
      rendererType == 'SpinVditorIRDOM' || rendererType == 'Md2VditorIRDOM'
        ? 'ir'
        : 'sv'
    const text = ['linkText', 'linkDest', 'image'].includes(nodeType)
      ? html`${node.TokensStr()}`
      : nodeType
    if (nodeType == 'linkText') {
      return [
        mode == 'ir'
          ? `<span class="vditor-ir__link">${text}</span>`
          : `<span class="vditor-sv__marker--bracket" data-type="link-text">${text}</span>`,
        Lute.WalkContinue,
      ]
    }
    const extraClass =
      {
        '[': ` vditor-${mode}__marker--bracket`,
        ']': ` vditor-${mode}__marker--bracket`,
        '(': ` vditor-${mode}__marker--paren`,
        ')': ` vditor-${mode}__marker--paren`,
        linkDest: ` vditor-${mode}__marker--link`,
      }[nodeType] || ''
    return [
      `<span class="vditor-${mode}__marker${extraClass}">${text}</span>`,
      Lute.WalkContinue,
    ]
  }
  return false
}

const defaultRenderResult = (): LuteRenderResult => ['', Lute.WalkContinue]
const shouldRenderMarkersOrDefault = (
  nodeType: string,
  rendererType: string,
  node: ILuteNode,
  entering: boolean
): LuteRenderResult =>
  shouldRenderMarkers(nodeType, rendererType, node, entering) ||
  defaultRenderResult()

export const customRenderers = (
  rendererType: string,
  context?: VditorContext
): ILuteRender => {
  const renderState: RenderState[] = []
  return {
    renderBang: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, 'bang', node, entering)
      return shouldRenderMarkersOrDefault('!', rendererType, node, entering)
    },
    renderLink: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, 'link', node, entering)
      return ['', Lute.WalkContinue]
    },
    renderOpenBracket: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, '[', node, entering)
      return shouldRenderMarkersOrDefault('[', rendererType, node, entering)
    },
    renderCloseBracket: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, ']', node, entering)
      return shouldRenderMarkersOrDefault(']', rendererType, node, entering)
    },
    renderOpenParen: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, '(', node, entering)
      return shouldRenderMarkersOrDefault('(', rendererType, node, entering)
    },
    renderCloseParen: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, ')', node, entering)
      if (entering) {
        return shouldRenderMarkersOrDefault(')', rendererType, node, entering)
      } else {
        let html = ''
        if (renderState.length == 0) {
          console.error('Unknown render state')
        } else {
          const state = renderState[renderState.length - 1]
          if (state.type == 'image') {
            renderState.pop()
            html = renderImage(state.dest || '', state.text || '', context)
          } else if (state.type == 'link') {
            renderState.pop()
            html = renderLink(
              state.dest || '',
              state.text || '',
              rendererType,
              context
            )
          } else {
            console.error('Unknown render state type', state)
          }
          if (
            rendererType == 'SpinVditorSVDOM' ||
            (['SpinVditorIRDOM', 'Md2VditorIRDOM'].includes(rendererType) &&
              state.type == 'link')
          ) {
            return defaultRenderResult()
          }
        }
        return [html, Lute.WalkContinue]
      }
    },
    renderImage: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, 'image', node, entering)
      if (entering) {
        renderState.push({ type: 'image' })
      }
      return shouldRenderMarkersOrDefault('image', rendererType, node, entering)
    },
    renderLinkText: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, 'link-text', node, entering, node.TokensStr())
      if (entering) {
        if (
          renderState.length == 0 ||
          renderState[renderState.length - 1].type != 'image'
        ) {
          renderState.push({ type: 'link', text: node.TokensStr() })
        } else {
          renderState[renderState.length - 1].text = node.TokensStr()
        }
        return shouldRenderMarkersOrDefault(
          'linkText',
          rendererType,
          node,
          entering
        )
      }
      return defaultRenderResult()
    },
    renderLinkDest: (node: ILuteNode, entering: boolean) => {
      console.log(rendererType, 'link-dest', node, entering, node.TokensStr())
      if (entering) {
        return shouldRenderMarkersOrDefault(
          'linkDest',
          rendererType,
          node,
          entering
        )
      } else {
        if (renderState.length == 0) {
          console.error('Unknown render state')
        } else {
          const state = renderState[renderState.length - 1]
          if (state.type == 'image' || state.type == 'link') {
            state.dest = node.TokensStr()
          } else {
            console.error('Unknown render state type', state)
          }
        }
        return defaultRenderResult()
      }
    },
  }
}

export const beforeGetMarkdown = (currentMode: string, el: HTMLElement) => {
  if (currentMode == 'wysiwyg') {
    const clone = el.cloneNode(true) as HTMLElement
    ;[].forEach.call(
      clone.querySelectorAll('img.post_smily, img.post_attachment'),
      (img: HTMLImageElement) => {
        img.src = img.getAttribute('data-x-original-src') || ''
        img.alt = img.getAttribute('data-x-original-alt') || ''
      }
    )
    ;[].forEach.call(
      clone.querySelectorAll('a.post_at_user'),
      (a: HTMLAnchorElement) => {
        a.href = a.getAttribute('data-x-original-href') || ''
      }
    )
    ;[].forEach.call(
      clone.querySelectorAll('a.post_attachment'),
      (a: HTMLAnchorElement) => {
        a.href = a.getAttribute('data-x-original-href') || ''
        const text = a.getAttribute('data-x-original-alt') || ''
        if (a.replaceChildren) {
          a.replaceChildren(text)
        } else {
          while (a.childNodes.length) {
            a.removeChild(a.childNodes[0])
          }
          a.appendChild(document.createTextNode(text))
        }
      }
    )
    return clone.innerHTML
  }
  return undefined
}

export const transformPreviewHtml = (html: string, context: VditorContext) => {
  const container = document.createElement('div')
  container.innerHTML = DOMPurify.sanitize(html, {
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|xxx|i|at?):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$)|s)/i,
  })
  ;[].forEach.call(
    container.querySelectorAll('img'),
    (img: HTMLImageElement) => {
      const src = img.getAttribute('src')
      if (src == 's') {
        const smiley = unifiedSmilyMap[parseInt(img.alt || '')]
        if (smiley) {
          img.src = `${kSmilyBasePath}${smiley}`
          img.className = 'post_smily'
          return
        }
        img.src = ''
        return
      }

      img.loading = 'lazy'
      const match = src?.match(/^(?:i|a):([0-9]+)$/)
      if (match) {
        const id = parseInt(match[1])
        const attach = context?.attachments?.find(
          (item) => item.attachment_id == id
        )
        if (attach) {
          context?.inlineAttachments?.add(attach.attachment_id)
          let fullSizePath = siteRoot + attach.path
          let rawUrl = attach.raw_url
          // TODO: Remove this after backend correctly return paths.
          if (attach.thumbnail_url) {
            if (!rawUrl) {
              rawUrl = fullSizePath
            }
            fullSizePath = attach.thumbnail_url + '?variant=original'
          }
          img.src = attach.thumbnail_url
            ? attach.thumbnail_url
            : siteRoot + attach.path
          img.className = 'post_attachment post_attachment_image'
          img.loading = 'lazy'
          img.setAttribute('data-x-filename', attach.filename)
          img.setAttribute('data-x-fullsize-path', fullSizePath)
          return
        }
        img.src = ''
        return
      }
    }
  )
  ;[].forEach.call(container.querySelectorAll('a'), (a: HTMLAnchorElement) => {
    const href = a.getAttribute('href')
    const atMatch = href?.match(/^at:(\d+)$/)
    if (atMatch) {
      a.className = 'post_at_user'
      a.href = `/user/${atMatch[1]}`
      return
    }
    const attachMatch = href?.match(/^a:(\d+)$/)
    if (attachMatch) {
      const id = parseInt(attachMatch[1])
      const attach = context?.attachments?.find(
        (item) => item.attachment_id == id
      )
      if (attach) {
        context?.inlineAttachments?.add(attach.attachment_id)
        a.className = 'post_attachment post_attachment_file'
        a.href = attach.download_url || 'javascript:void(0)'

        if (attach.download_url) {
          if (attach.filename.match(/\.(mp4|flv)$/i)) {
            const div = document.createElement('div')
            const video = document.createElement('video')
            video.className = 'post_attachment_video'
            video.controls = true
            video.src = attach.download_url
            div.appendChild(video)
            a.insertAdjacentElement('afterend', div)
          }
          if (attach.filename.match(/\.mp3$/i)) {
            const audio = document.createElement('audio')
            audio.className = 'post_attachment_audio'
            audio.controls = true
            audio.src = attach.download_url
            a.insertAdjacentElement('afterend', audio)
          }
        }
      } else {
        console.warn('bad attachment', href)
        a.href = ''
      }
      return
    }

    if (href) {
      const newUrl = href.startsWith('#') ? href : transformLink(href) || href
      if (newUrl) {
        a.href = transformLegacyLinks(newUrl)
        if (!newUrl.match(/^(?:\/|https?:\/*bbs\.uestc\.edu\.cn|#)/)) {
          a.target = '_blank'
          a.rel = 'noopener'
        }
      }
    }
  })
  return container.innerHTML
}
