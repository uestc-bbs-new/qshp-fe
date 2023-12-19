import Vditor from 'vditor'
import 'vditor/dist/index.css'

import React, { useEffect, useState } from 'react'

import { useAppState } from '@/states'

import options, { getPreviewThemeOptions } from './config'
import { customRenderers } from './renderer'

type props = IOptions & {
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>
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
