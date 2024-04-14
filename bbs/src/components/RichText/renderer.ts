import { html } from '@/utils/html'
import siteRoot from '@/utils/siteRoot'

import { unifiedSmilyMap } from './smilyData'
import { VditorContext } from './types'

type RenderState = {
  type: 'image' | 'link'
  text?: string
  dest?: string
}

const kForumAttachBasePath = siteRoot
export const kSmilyBasePath = siteRoot + '/static/image/smiley/'

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
    const path = attachment?.thumbnail_url || attachment?.path
    if (path) {
      return html`<img
        src="${kForumAttachBasePath}${path}"
        data-x-fullsize-path="${kForumAttachBasePath}${attachment?.path}"
        alt="${alt}"
        class="post_attachment post_attachment_image"
        loading="lazy"
        data-x-special-kind="attachment"
        data-x-original-src="${src}"
        data-x-original-alt="${alt}"
      />`
    }
  }
  return html`<img src="${src}" alt="${alt || ''}" />`
}
const renderLink = (href: string, text: string, context?: VditorContext) => {
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
      return html`<a
        class="post_attachment post_attachment_file"
        href="${attach.download_url || 'javascript:void(0)'}"
        download="${attach.filename}"
        data-x-special-kind="attachment"
        data-x-original-src="${href}"
        data-x-original-alt="${text}"
        >${text}</a
      >`
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
            html = renderLink(state.dest || '', state.text || '', context)
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
