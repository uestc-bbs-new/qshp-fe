import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Typography,
  darken,
  getContrastRatio,
  getLuminance,
  lighten,
  useMediaQuery,
} from '@mui/material'

import { Attachment } from '@/common/interfaces/base'
import { PostFloor } from '@/common/interfaces/response'
import { useAppState } from '@/states'
import bbcode2html, { FontSizeVariant } from '@/utils/bbcode/bbcode'

import '../../../../markdown-renderer/src/renderer/richtext.css'
import { getPreviewOptions } from '../../../../markdown-renderer/src/renderer/vditorConfig'
import { onClickHandler } from './eventHandlers'
import './legacy.css'
import { transformUserHtml } from './transform'

const kAuthoredColor = 'authoredColor'
const kColorManipulated = 'colorManipulated'

export const UserHtmlRenderer = ({
  html,
  // TODO: Maybe render orphan attachment with React?
  orphanAttachments,
  style,
  normalizeLegacyFontSize,
  Component,
}: {
  html: string
  orphanAttachments?: Attachment[]
  style?: React.CSSProperties
  normalizeLegacyFontSize?: boolean
  Component?: React.ElementType
}) => {
  const Container = Component ?? 'div'
  const { state } = useAppState()
  const contentRef = useRef<HTMLElement>(null)
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

  const sizeVariant = useMediaQuery('(max-width: 640px)') ? 'small' : 'default'
  const processedHtml = useMemo(
    () => transformUserHtml(html, normalizeLegacyFontSize, sizeVariant),
    [html, sizeVariant]
  )
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  return (
    <Container
      ref={contentRef}
      className={`rich-text-content rich-text-content-legacy rich-text-theme-${state.theme}`}
      style={style}
      dangerouslySetInnerHTML={{
        __html: processedHtml,
      }}
      onClickCapture={(e: React.MouseEvent<HTMLElement>) =>
        onClickHandler(e, navigate, dispatch)
      }
    ></Container>
  )
}

type PickedPost = Pick<
  PostFloor,
  'format' | 'smileyoff' | 'post_id' | 'message' | 'attachments'
>

export const renderLegacyPostToDangerousHtml = (
  post: PickedPost,
  orphanAttachments?: Attachment[],
  sizeVariant?: FontSizeVariant
) =>
  bbcode2html(
    post.message,
    {
      bbcodeoff: post.format != 0,
      smileyoff: !!post.smileyoff,
      // TODO: legacyPhpwindAt: post.post_id >= ???
      legacyPhpwindAt: post.post_id <= 24681051,
      legacyPhpwindCode: post.post_id <= 24681051,
      sizeVariant,
    },
    post.attachments,
    orphanAttachments
  )

export const LegacyPostRenderer = ({ post }: { post: PickedPost }) => {
  const orphanAttachments: Attachment[] = []
  const html = renderLegacyPostToDangerousHtml(
    post,
    orphanAttachments,
    useMediaQuery('(max-width: 640px)') ? 'small' : 'default'
  )
  return <UserHtmlRenderer html={html} orphanAttachments={orphanAttachments} />
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
    ;(async () => {
      const Vditor = (await import('vditor')).default
      el.current &&
        Vditor.preview(
          el.current,
          message,
          getPreviewOptions(state.theme, {
            attachments: attachments || [],
          })
        )
    })()
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
