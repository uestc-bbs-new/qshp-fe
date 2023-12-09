import Vditor from 'vditor'

import { useEffect, useRef } from 'react'

import { Typography } from '@mui/material'

import { PostFloor } from '@/common/interfaces/response'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bbcode2html from '@/utils/bbcode/bbcode'

import './richtext.css'

export type PropsType = {
  message: string
  format: number
}

export function ParseLegacy({ post }: { post: PostFloor }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: bbcode2html(post.message, {
          allowimgurl: true,
          bbcodeoff: post.format != 0,
          parseurloff: post.parseurloff,
          smileyoff: post.smileyoff,
        }),
      }}
    ></div>
  )
}

function ParseMd({ message }: { message: string }) {
  const el = useRef(null)
  useEffect(() => {
    Vditor.preview(el.current as unknown as HTMLDivElement, message)
  }, [])
  return <Typography color="text.primary" ref={el}></Typography>
}

export function ParsePost({ post }: { post: PostFloor }) {
  return (
    <div
      className={`rich-text-content rich-text-content-${
        post.format == 2 ? 'markdown' : 'legacy'
      }`}
    >
      {post.format == 2 ? (
        <ParseMd message={post.message} />
      ) : (
        <ParseLegacy post={post} />
      )}
    </div>
  )
}
