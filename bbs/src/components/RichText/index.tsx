import Vditor from 'vditor'

import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Typography,
  darken,
  getContrastRatio,
  getLuminance,
  lighten,
} from '@mui/material'

import { Attachment } from '@/common/interfaces/base'
import { PostFloor } from '@/common/interfaces/response'
import { getPreviewOptions } from '@/components/RichText/vditorConfig'
import { useAppState } from '@/states'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import bbcode2html from '@/utils/bbcode/bbcode'

import { onClickHandler } from './eventHandlers'
import './richtext.css'
import { transformUserHtml } from './transform'

const kAuthoredColor = 'authoredColor'
const kColorManipulated = 'colorManipulated'

export const UserHtmlRenderer = ({
  html,
  style,
}: {
  html: string
  style?: React.CSSProperties
}) => {
  const { state } = useAppState()
  const contentRef = useRef<HTMLDivElement>(null)
  const findParentBackgroundColor = (
    el: HTMLElement,
    upTo: HTMLElement | null
  ) => {
    let cur: HTMLElement | null = el
    for (; cur && cur != upTo; cur = cur.parentElement) {
      if (cur.style.backgroundColor) {
        return getComputedStyle(cur).backgroundColor
      }
    }
  }
  useEffect(() => {
    if (contentRef.current) {
      ;[].forEach.call(
        contentRef.current.querySelectorAll('font, *[style]'),
        (el: HTMLElement) => {
          let authoredColor = el.dataset[kAuthoredColor]
          if (!authoredColor) {
            if (
              (el.tagName.toLowerCase() == 'font' &&
                el.getAttribute('color')) ||
              el.style.color
            ) {
              authoredColor = getComputedStyle(el).color
            }
          }
          const backColor = findParentBackgroundColor(el, contentRef.current)
          if (backColor) {
            if (!authoredColor) {
              el.style.color = 'rgba(0, 0, 0, 0.87)'
              el.dataset[kAuthoredColor] = ''
            }
            return
          }
          if (!authoredColor) {
            return
          }
          let manipulation = el.dataset[kColorManipulated]
          if (
            (manipulation == 'lighten' && state.theme == 'light') ||
            (manipulation == 'darken' && state.theme == 'dark')
          ) {
            el.style.color = authoredColor
            delete el.dataset[kColorManipulated]
            return
          }
          const luminance = getLuminance(authoredColor)
          const contrast = getContrastRatio(
            authoredColor,
            state.theme == 'light' ? '#ffffff' : '#313742'
          )
          if (contrast > 4) {
            return
          }
          let newColor = authoredColor
          if (state.theme == 'light' && luminance > 0.75) {
            newColor = darken(
              newColor,
              Math.pow(4, 0.6) * Math.pow(1 - luminance, 0.6)
            )
            manipulation = 'darken'
          } else if (state.theme == 'dark' && luminance < 0.25) {
            newColor = lighten(
              newColor,
              -Math.pow(4, 0.6) * Math.pow(luminance, 0.6) + 1
            )
            manipulation = 'lighten'
          }
          if (newColor != authoredColor) {
            el.style.color = newColor
            if (manipulation) {
              el.dataset[kColorManipulated] = manipulation
            }
            if (el.dataset[kAuthoredColor] == undefined) {
              el.dataset[kAuthoredColor] = authoredColor
            }
          }
        }
      )
    }
  }, [state.theme])

  const processedHtml = useMemo(() => transformUserHtml(html), [html])
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  return (
    <div
      ref={contentRef}
      className={`rich-text-content rich-text-content-legacy rich-text-theme-${state.theme}`}
      style={style}
      dangerouslySetInnerHTML={{
        __html: processedHtml,
      }}
      onClickCapture={(e) => onClickHandler(e, navigate, dispatch)}
    ></div>
  )
}

const LegacyPostRenderer = ({ post }: { post: PostFloor }) => {
  return (
    <UserHtmlRenderer
      html={bbcode2html(post.message, {
        allowimgurl: true,
        bbcodeoff: post.format != 0,
        smileyoff: post.smileyoff,
      })}
    />
  )
}

const MarkdownPostRenderer = ({
  message,
  attachments,
}: {
  message: string
  attachments?: Attachment[]
}) => {
  const { state } = useAppState()
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    el.current &&
      Vditor.preview(
        el.current,
        message,
        getPreviewOptions(state.theme, {
          attachments: attachments || [],
        })
      )
  }, [message])
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  return (
    <div
      className={`rich-text-content rich-text-content-markdown rich-text-theme-${state.theme}`}
      onClickCapture={(e) => onClickHandler(e, navigate, dispatch)}
    >
      <Typography color="text.primary" ref={el}></Typography>
    </div>
  )
}

export const PostRenderer = ({ post }: { post: PostFloor }) => {
  return post.format == 2 ? (
    <MarkdownPostRenderer
      message={post.message}
      attachments={post.attachments}
    />
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
