import Vditor from 'vditor'

import { createRef, useEffect } from 'react'

import { Typography, darken, getContrastRatio, lighten } from '@mui/material'

import { PostFloor } from '@/common/interfaces/response'
import { getPreviewOptions } from '@/components/RichText/vditorConfig'
import { useAppState } from '@/states'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bbcode2html from '@/utils/bbcode/bbcode'

import './richtext.css'

const kAuthoredColor = 'authoredColor'

const LegacyPostRenderer = ({ post }: { post: PostFloor }) => {
  const { state } = useAppState()
  const contentRef = createRef<HTMLDivElement>()
  useEffect(() => {
    if (contentRef.current) {
      ;[].forEach.call(
        contentRef.current.querySelectorAll('font, *[style]'),
        (el: HTMLElement) => {
          const color = el.dataset[kAuthoredColor] || getComputedStyle(el).color
          if (!color) {
            return
          }
          const contrast = getContrastRatio(
            color,
            state.theme == 'light' ? '#ffffff' : '#313742'
          )
          const contrastThreshold = state.theme == 'light' ? 1 : 4
          if (contrast < contrastThreshold) {
            const newColor =
              state.theme == 'light' ? darken(color, 0.2) : lighten(color, 0.5)
            el.style.color = newColor
            el.dataset[kAuthoredColor] = newColor
          }
        }
      )
    }
  }, [state.theme])
  return (
    <div
      ref={contentRef}
      className="rich-text-content rich-text-content-legacy"
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

const MarkdownPostRenderer = ({ message }: { message: string }) => {
  const { state } = useAppState()
  const el = createRef<HTMLDivElement>()
  useEffect(() => {
    el.current &&
      Vditor.preview(el.current, message, getPreviewOptions(state.theme))
  }, [message])
  return (
    <div className="rich-text-content rich-text-content-markdown">
      <Typography color="text.primary" ref={el}></Typography>
    </div>
  )
}

export const PostRenderer = ({ post }: { post: PostFloor }) => {
  return post.format == 2 ? (
    <MarkdownPostRenderer message={post.message} />
  ) : (
    <LegacyPostRenderer post={post} />
  )
}

export const RichTextRenderer = ({
  message,
  format,
}: {
  message: string
  format: 'bbcode' | 'markdown'
}) =>
  format == 'bbcode' ? (
    <LegacyPostRenderer post={{ message, format: 0 } as PostFloor} />
  ) : (
    <MarkdownPostRenderer message={message} />
  )
