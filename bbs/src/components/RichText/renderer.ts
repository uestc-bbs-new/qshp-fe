import siteRoot from '@/utils/siteRoot'

import { unifiedSmilyMap } from './smilyData'

type RenderState = {
  type: 'image' | 'link'
  text?: string
  dest?: string
}

const kForumAttachBasePath = siteRoot + '/data/attachment/forum/'
export const kSmilyBasePath = siteRoot + '/static/image/smiley/'
function replace(
  str: string,
  patterns: RegExp[],
  replacements: string | string[]
): string {
  patterns.forEach((pattern, i) => {
    const replacement =
      typeof replacements === 'string' ? replacements : replacements[i]
    str = str.replace(pattern, replacement)
  })
  return str
}
// Implemented according to https://www.php.net/manual/en/function.htmlspecialchars.php, without ENT_QUOTES.
function htmlspecialchars(str: string): string {
  return replace(
    str,
    [/&/g, /"/g, /</g, />/g],
    ['&amp;', '&quot;', '&lt;', '&gt;']
  )
}

function html(strings: TemplateStringsArray, ...texts: string[]): string {
  return strings
    .map((chunk, i) =>
      i < texts.length ? chunk + htmlspecialchars(texts[i]) : chunk
    )
    .join('')
}

const renderImage = (src: string, alt: string) => {
  if (src == 's' && unifiedSmilyMap[parseInt(alt || '')]) {
    return html`<img
      src="${kSmilyBasePath}${unifiedSmilyMap[parseInt(alt || '')]}"
      class="post_smily"
      data-x-special-kind="smily"
      data-x-original-src="${src}"
      data-x-original-alt="${alt}"
    />`
  }
  const match = src.match(/^a:([0-9]+)/)
  if (match) {
    // attachment
    return ''
  }
  return html`<img src="${src}" alt="${alt || ''}" />`
}
const renderLink = (href: string, text: string) => {
  const atMatch = href.match(/^at:(\d+)/)
  if (atMatch) {
    return html`<a
      class="post_at_user"
      href="/user/${atMatch[1]}"
      data-x-original-href="${href}"
      >${text}</a
    >`
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

export const customRenderers = (rendererType: string): ILuteRender => {
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
            html = renderImage(state.dest || '', state.text || '')
          } else if (state.type == 'link') {
            renderState.pop()
            html = renderLink(state.dest || '', state.text || '')
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
