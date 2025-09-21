import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Article, AttachFile } from '@mui/icons-material'
import {
  Alert,
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
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
import { chineseTime } from '@/utils/dayjs'

import '../../../../markdown-renderer/src/renderer/richtext.css'
import { VditorContext } from '../../../../markdown-renderer/src/renderer/types'
import { getPreviewOptions } from '../../../../markdown-renderer/src/renderer/vditorConfig'
import Link from '../Link'
import {
  PostExtraDetailsAccordian,
  PostExtraDetailsContainer,
} from '../Post/PostExtraDetails'
import {
  SummaryAttachmentGrid,
  SummaryAttachmentImage,
} from '../ThreadItem/Summary'
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
  sizeVariant?: FontSizeVariant,
  removeEditPrompt?: boolean,
  narrowView?: boolean
) =>
  bbcode2html(
    removeEditPrompt
      ? post.message.replace(
          /^\[i=s\] 本帖最后由 (.+?) 于 (.+?) 编辑 \[\/i\]\s*/,
          ''
        )
      : post.message,
    {
      bbcodeoff: post.format != 0,
      smileyoff: !!post.smileyoff,
      // TODO: legacyPhpwindAt: post.post_id >= ???
      legacyPhpwindAt: post.post_id <= 24681051,
      legacyPhpwindCode: post.post_id <= 24681051,
      sizeVariant,
      narrowView,
    },
    post.attachments,
    orphanAttachments
  )

export const LegacyPostRenderer = ({
  post,
  removeEditPrompt,
}: {
  post: PickedPost
  removeEditPrompt?: boolean
}) => {
  const orphanAttachments: Attachment[] = []
  const narrowView = useMediaQuery('(max-width: 640px)')
  const html = renderLegacyPostToDangerousHtml(
    post,
    orphanAttachments,
    useMediaQuery('(max-width: 640px)') ? 'small' : 'default',
    removeEditPrompt,
    narrowView
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
  const [loadingState, setLoadingState] = useState<'loading' | 'error' | ''>(
    'loading'
  )
  const el = useRef<HTMLDivElement>(null)
  const renderContext = useRef<VditorContext>()
  const [orphanAttachments, setOrphanAttachments] = useState<Attachment[]>()
  useEffect(() => {
    ;(async () => {
      const Vditor = (await import('vditor')).default
      if (!el.current) {
        return
      }
      renderContext.current = {
        attachments: attachments || [],
        inlineAttachments: new Set(),
      }
      Vditor.preview(
        el.current,
        message,
        getPreviewOptions(state.theme, renderContext.current)
      )
        .then(() => {
          setOrphanAttachments(
            renderContext.current?.attachments.filter(
              (item) =>
                !renderContext.current?.inlineAttachments?.has(
                  item.attachment_id
                )
            )
          )
          setLoadingState('')
        })
        .catch(() => setLoadingState('error'))
    })()
  }, [message, attachments])
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  return (
    <>
      <div
        className={`rich-text-content rich-text-content-markdown rich-text-theme-${state.theme}`}
        onClickCapture={(e) => onClickHandler(e, navigate, dispatch)}
        css={
          loadingState ? { minHeight: '48px', position: 'relative' } : undefined
        }
      >
        {loadingState && (
          <Alert
            icon={loadingState == 'loading' ? false : undefined}
            severity={loadingState == 'error' ? 'error' : 'info'}
            sx={{ mb: 1, position: 'absolute', left: 0, top: 0, right: 0 }}
          >
            <Stack direction="row" alignItems="center">
              {loadingState == 'loading' ? (
                <>
                  <CircularProgress size="1.5em" />
                  <Typography ml={1} variant="threadItemSummary">
                    内容加载中，若长时间未显示请刷新页面……
                  </Typography>
                </>
              ) : (
                <>
                  <Typography>加载失败，请刷新重试。</Typography>
                </>
              )}
            </Stack>
          </Alert>
        )}
        <Typography color="text.primary" ref={el}></Typography>
      </div>
      {!!orphanAttachments?.length && (
        <PostExtraDetailsContainer loading={false} hasContent>
          <PostExtraDetailsAccordian Icon={AttachFile} title="附件">
            <Grid container>
              {orphanAttachments.map((item) =>
                item.is_image ? (
                  <SummaryAttachmentImage
                    key={item.attachment_id}
                    item={item}
                  />
                ) : (
                  <SummaryAttachmentGrid key={item.attachment_id}>
                    <Tooltip
                      key={item.attachment_id}
                      title={
                        <Stack>
                          <Typography>{item.filename}</Typography>
                        </Stack>
                      }
                    >
                      <Link
                        to={item.download_url ?? ''}
                        external
                        download={item.filename}
                        width="100%"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                      >
                        <Stack
                          flexGrow={1}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Article fontSize="large" htmlColor="#aaa" />
                        </Stack>
                        <Typography
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          width="100%"
                        >
                          {item.filename}
                        </Typography>
                      </Link>
                    </Tooltip>
                  </SummaryAttachmentGrid>
                )
              )}
            </Grid>
          </PostExtraDetailsAccordian>
        </PostExtraDetailsContainer>
      )}
    </>
  )
}

export const PostRenderer = ({ post }: { post: PostFloor }) => {
  const hasEditPrompt = !!(post.last_edit_time && post.last_editor)
  return (
    <>
      {hasEditPrompt && !!post.last_edit_time && (
        <Typography variant="postEditPrompt" paragraph mb={1}>
          本帖最后由 {post.last_editor} 于{' '}
          {chineseTime(post.last_edit_time * 1000)} 编辑
        </Typography>
      )}
      {post.format == 2 ? (
        <MarkdownPostRenderer
          message={post.message}
          attachments={post.attachments}
        />
      ) : (
        <LegacyPostRenderer post={post} removeEditPrompt={hasEditPrompt} />
      )}
    </>
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
