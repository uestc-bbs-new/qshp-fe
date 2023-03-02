import Vditor from 'vditor'
import 'vditor/dist/index.css'

import React, { useEffect } from 'react'

import { useAppState } from '@/states'

import options from './config'

type props = IOptions & {
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>
}
const Editor = ({ setVd, ...other }: props) => {
  const { state } = useAppState()
  useEffect(() => {
    const vditor = new Vditor('vditor', {
      after: () => {
        setVd(vditor)
      },
      ...options,
      ...other,
      // TODO: the theme only useful when init, can't response to the state.theme change
      // consider setTheme() instead
      theme: state.theme === 'light' ? 'classic' : 'dark',
      // TODO: the content theme should be changed when it's dark
      // contentTheme: state.theme === 'light' ? 'classic' : 'dark',
    })
  }, [])
  return <div id="vditor" className="vditor flex-1" />
}

export default Editor
