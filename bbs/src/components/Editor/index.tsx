import Vditor from 'vditor'
import 'vditor/dist/index.css'

import React, { useEffect, useState } from 'react'

import { useAppState } from '@/states'

import options from './config'

type props = IOptions & {
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>
}
const Editor = ({ setVd, ...other }: props) => {
  const { state } = useAppState()
  const [vditor, setVditor] = useState<Vditor | undefined>(undefined)
  useEffect(() => {
    const vd = new Vditor('vditor', {
      after: () => {
        setVditor(vd)
        setVd(vd)
      },
      ...options,
      ...other,
      theme: state.theme === 'light' ? 'classic' : 'dark',
    })
  }, [state.theme])

  useEffect(() => {
    if (vditor) {
      vditor.setTheme(
        state.theme === 'light' ? 'classic' : 'dark',
        state.theme === 'light' ? 'classic' : 'dark'
      )
    }
  }, [state.theme, vditor])
  return <div id="vditor" className="vditor flex-1" />
}

export default Editor
