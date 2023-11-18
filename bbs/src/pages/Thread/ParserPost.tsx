import Vditor from 'vditor'

import { useEffect, useRef } from 'react'

import { Typography } from '@mui/material'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bbcode2html from '@/utils/bbcode/bbcode'

export type PropsType = {
  message: string
  format: number
}

function ParseCode({ message }: Omit<PropsType, 'format'>) {
  return (
    <div
      className="parse"
      dangerouslySetInnerHTML={{ __html: bbcode2html(message) }}
    ></div>
  )
}

function ParseMd({ message }: Omit<PropsType, 'format'>) {
  const el = useRef(null)
  useEffect(() => {
    Vditor.preview(el.current as unknown as HTMLDivElement, message)
  }, [])
  return <Typography color="text.primary" ref={el}></Typography>
}

export function ParsePost({ message, format }: PropsType) {
  return (
    <>
      {format == 2 ? <ParseMd message={message} /> : format == 0 ? <ParseCode message={message} /> : <Typography color="text.primary" component="pre">{message}</Typography>}
    </>
  )
}
