import Vditor from 'vditor'
import 'vditor/dist/index.css'

import React, { useEffect, useState } from 'react'

import { useAppState } from '@/states'
import siteRoot from '@/utils/siteRoot'

import options, { getPreviewThemeOptions } from './config'
import { smilyMaps } from './smilyData'

type props = IOptions & {
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>
}

type RenderState = {
  type: 'image' | 'link'
  text?: string
  dest?: string
}

const kForumAttachBasePath = siteRoot + '/data/attachment/forum/'
const kSmilyBasePath = siteRoot + '/static/image/smiley/'
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
  if (src == 's' && smilyMaps['s'][parseInt(alt || '')]) {
    return `<img src="${kSmilyBasePath}${
      smilyMaps['s'][parseInt(alt || '')]
    }" class="post_smily" data-x-special-kind="smily" data-x-original-src="${src}" data-x-original-alt="${alt}">`
  }
  const match = src.match(/^a:([0-9]+)/)
  if (match) {
    // attachment
    return ''
  }
  return html`<img src="${src}" alt="${alt || ''}" />`
}
const renderLink = (href: string, text: string) => {
  return ''
}

const shouldRenderMarkers = (
  nodeType: string,
  rendererType: string,
  node: ILuteNode,
  entering: boolean
) => {
  // See also lute/render/vditor_{ir,sv}_renderer.go for reference implementation.
  // `node.Parent.LinkType == 3` is not implemented yet.
  if (
    ['SpinVditorIRDOM', 'SpinVditorSVDOM', 'Md2VditorIRDOM'].includes(
      rendererType
    ) &&
    entering
  ) {
    const mode =
      rendererType == 'SpinVditorIRDOM' || rendererType == 'Md2VditorIRDOM'
        ? 'ir'
        : 'sv'
    const lex = ['linkText', 'linkDest', 'image'].includes(nodeType)
      ? node.TokensStr()
      : nodeType
    const extraClass =
      {
        '[': ` vditor-${mode}__marker--bracket`,
        ']': ` vditor-${mode}__marker--bracket`,
        linkText: ` vditor-${mode}__marker--bracket`,
        '(': ` vditor-${mode}__marker--paren`,
        ')': ` vditor-${mode}__marker--paren`,
        linkDest: ` vditor-${mode}__marker--link`,
      }[nodeType] || ''
    if (nodeType == 'image' && rendererType == 'SpinVditorIRDOM') {
      return [
        entering
          ? `<span class="vditor-ir__node vditor-ir__node--expand" data-type="img">`
          : `</span>`,
        Lute.WalkContinue,
      ]
    }
    return [
      `<span class="vditor-${mode}__marker${extraClass}">${lex}</span>`,
      Lute.WalkContinue,
    ]
  }
  return false
}

const customRenderers = (rendererType: string) => {
  return ((rendererType: string) => {
    const renderState: RenderState[] = []
    return {
      renderBang: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, 'bang', node, entering)
        return (
          shouldRenderMarkers('!', rendererType, node, entering) || [
            '',
            Lute.WalkContinue,
          ]
        )
      },
      renderLink: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, 'link', node, entering)
        return ['', Lute.WalkContinue]
      },
      renderOpenBracket: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, '[', node, entering)
        return (
          shouldRenderMarkers('[', rendererType, node, entering) || [
            '',
            Lute.WalkContinue,
          ]
        )
      },
      renderCloseBracket: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, ']', node, entering)
        return (
          shouldRenderMarkers(']', rendererType, node, entering) || [
            '',
            Lute.WalkContinue,
          ]
        )
      },
      renderOpenParen: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, '(', node, entering)
        return (
          shouldRenderMarkers('(', rendererType, node, entering) || [
            '',
            Lute.WalkContinue,
          ]
        )
      },
      renderCloseParen: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, ')', node, entering)
        if (entering) {
          return (
            shouldRenderMarkers(')', rendererType, node, entering) || [
              '',
              Lute.WalkContinue,
            ]
          )
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
          }
          if (rendererType == 'SpinVditorSVDOM') {
            return ['', Lute.WalkContinue]
          }
          return [html, Lute.WalkContinue]
        }
      },
      renderImage: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, 'image', node, entering)
        if (entering) {
          renderState.push({ type: 'image' })
        }
        return (
          shouldRenderMarkers('image', rendererType, node, entering) || [
            '',
            Lute.WalkContinue,
          ]
        )
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
          return (
            shouldRenderMarkers('linkDest', rendererType, node, entering) || [
              '',
              Lute.WalkContinue,
            ]
          )
        }
        return ['', Lute.WalkContinue]
      },
      renderLinkDest: (node: ILuteNode, entering: boolean) => {
        console.log(rendererType, 'link-dest', node, entering, node.TokensStr())
        if (entering) {
          return (
            shouldRenderMarkers('linkDest', rendererType, node, entering) || [
              '',
              Lute.WalkContinue,
            ]
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
          return ['', Lute.WalkContinue]
        }
      },
    }
  })(rendererType)
}

const Editor = ({ setVd, ...other }: props) => {
  const { state } = useAppState()
  const [vditor, setVditor] = useState<Vditor | undefined>(undefined)
  const theme = state.theme === 'light' ? undefined : 'dark'
  useEffect(() => {
    const vd = new Vditor('vditor', {
      after: () => {
        vd.vditor.lute.SetJSRenderers({
          renderers: {
            SpinVditorDOM: customRenderers('SpinVditorDOM'),
            SpinVditorIRDOM: customRenderers('SpinVditorIRDOM'),
            SpinVditorSVDOM: customRenderers('SpinVditorSVDOM'),
            Md2VditorDOM: customRenderers('Md2VditorDOM'),
            Md2VditorIRDOM: customRenderers('Md2VditorIRDOM'),
            Md2HTML: customRenderers('Md2HTML'),
          } as object,
        })
        setVditor(vd)
        setVd(vd)
      },
      beforeGetMarkdown: (currentMode: string, el: HTMLElement) => {
        if (currentMode == 'wysiwyg') {
          const clone = el.cloneNode(true) as HTMLElement
          ;[].forEach.call(
            clone.querySelectorAll('img.post_smily'),
            (img: HTMLImageElement) => {
              img.src = img.getAttribute('data-x-original-src') || ''
              img.alt = img.getAttribute('data-x-original-alt') || ''
            }
          )
          return clone.innerHTML
        }
        return undefined
      },
      ...options,
      preview: getPreviewThemeOptions(state.theme),
      ...other,
      theme,
    })
  }, [state.theme])

  useEffect(() => {
    if (vditor) {
      vditor.setTheme(theme || 'classic', theme)
    }
  }, [state.theme, vditor])
  return <div id="vditor" className="vditor flex-1" />
}

export default Editor
