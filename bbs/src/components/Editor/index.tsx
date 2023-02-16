import { useAppState } from '@/states'
import React, { useEffect } from 'react'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

import options from './config'

const Editor = () => {
  const { state } = useAppState()
  const [vd, setVd] = React.useState<Vditor>()
  useEffect(() => {
    const vditor = new Vditor('vditor', {
      after: () => {
        setVd(vditor)
      },
      ...options,
    })
  }, [])
  return <div id="vditor" className="vditor flex-1" />
}

export default Editor
