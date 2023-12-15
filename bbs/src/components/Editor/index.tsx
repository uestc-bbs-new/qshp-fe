import Vditor from 'vditor'
import 'vditor/dist/index.css'

import React, { useEffect, useState } from 'react'

import { useAppState } from '@/states'

import options, { getPreviewThemeOptions } from './config'

type props = IOptions & {
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>
}

type RenderState = {
  type: 'image' | 'link'
  text?: string
  href?: string
}

const customRenderers = (rendererType: string) => {
  return (() => {
    const renderState: RenderState[] = []
    return {
      renderImage: (node: ILuteNode, entering: boolean) => {
        console.log('image', node, entering)
        if (entering) {
          renderState.push({ type: 'image' })
        }
        return ['', Lute.WalkContinue]
      },
      renderLinkText: (node: ILuteNode, entering: boolean) => {
        console.log('link-text', node, entering, node.TokensStr())
        if (entering) {
          if (
            renderState.length == 0 ||
            renderState[renderState.length - 1].type != 'image'
          ) {
            renderState.push({ type: 'link', text: node.TokensStr() })
          } else {
            renderState[renderState.length - 1].text = node.TokensStr()
          }
        }
        return ['', Lute.WalkContinue]
      },
      renderLinkDest: (node: ILuteNode, entering: boolean) => {
        console.log('link-dest', node, entering, node.TokensStr())
        let html = ''
        const dest = node.TokensStr()
        if (entering) {
          if (renderState.length == 0) {
            console.error('Unknown render state')
          } else {
            const state = renderState[renderState.length - 1]
            if (state.type == 'image') {
              renderState.pop()
              html = `IMG:${state.text}/${dest}`
            } else if (state.type == 'link') {
              renderState.pop()
              html = `<a href="${dest}">${state.text}</a>`
            } else {
              console.error('Unknown render state type', state)
            }
          }
        }
        return [html, Lute.WalkContinue]
      },
    }
  })()
}

const Editor = ({ setVd, ...other }: props) => {
  const { state } = useAppState()
  const [vditor, setVditor] = useState<Vditor | undefined>(undefined)
  const theme = state.theme === 'light' ? undefined : 'dark'
  useEffect(() => {
    const vd = new Vditor('vditor', {
      after: () => {
        // vd.vditor.lute.SetJSRenderers({
        //   renderers: {
        //     SpinVditorDOM: customRenderers('SpinVditorDOM'),
        //     SpinVditorIRDOM: customRenderers('SpinVditorIRDOM'),
        //   },
        // })
        setVditor(vd)
        setVd(vd)
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
