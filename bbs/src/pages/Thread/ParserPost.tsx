import Vditor from 'vditor'

import { useEffect, useRef } from 'react'

import { Typography } from '@mui/material'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bbcode2html from '@/utils/bbcode/bbcode'
import { PostFloor } from '@/common/interfaces/response'

export type PropsType = {
  message: string
  format: number
}

function ParseLegacy({ post }: {post: PostFloor}) {
  return (
    <div
      className="parse"
      dangerouslySetInnerHTML={{ __html: bbcode2html(post.message, {
        allowimgurl: true,
        bbcodeoff: post.format != 0,
        parseurloff: false, //post.parseurloff,
        smileyoff: false, //post.smileyoff,
      }) }}
    ></div>
  )
  // return <Typography color="text.primary" component="pre">{post.message}</Typography>;
}

function ParseMd({ message }: {message: string}) {
  const el = useRef(null)
  useEffect(() => {
    Vditor.preview(el.current as unknown as HTMLDivElement, message)
  }, [])
  return <Typography color="text.primary" ref={el}></Typography>
}

export function ParsePost({ post }: {post: PostFloor}) {
  return (
    <>
      {post.format == 2 ? <ParseMd message={post.message} /> : <ParseLegacy post={post} />}
    </>
  )
}
