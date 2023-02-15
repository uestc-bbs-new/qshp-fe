import React, { useEffect } from 'react'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const Editor = () => {
  const [vd, setVd] = React.useState<Vditor>()
  useEffect(() => {
    const vditor = new Vditor('vditor', {
      after: () => {
        vditor.setValue('`Vditor` 最小代码示例')
        setVd(vditor)
      },
    })
  }, [])
  return <div id="vditor" className="vditor flex-1" />
}

export default Editor
