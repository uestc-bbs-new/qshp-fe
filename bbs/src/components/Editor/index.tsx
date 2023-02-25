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
    })
  }, [])
  return <div id="vditor" className="vditor flex-1" />
}

export default Editor
