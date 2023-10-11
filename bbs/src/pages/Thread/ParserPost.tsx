import Vditor from 'vditor'

import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bbcode2html from '@/utils/bbcode/bbcode'

export type PropsType = {
  message: string
  isMd: boolean | number
}

function ParseCode({ message }: Omit<PropsType, 'isMd'>) {
  return (
    <div
      className="parse"
      dangerouslySetInnerHTML={{ __html: bbcode2html(message) }}
    ></div>
  )
}

function ParseMd({ message }: Omit<PropsType, 'isMd'>) {
  const el = useRef(null)
  useEffect(() => {
    Vditor.preview(el.current as unknown as HTMLDivElement, message)
  }, [])
  return <div ref={el}></div>
}

export function ParsePost({ message, isMd }: PropsType) {
  return (
    <>
      {isMd ? <ParseMd message={message} /> : <ParseCode message={message} />}
    </>
  )
}
