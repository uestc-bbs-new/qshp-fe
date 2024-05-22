import React, { ReactNode } from 'react'

import PublishIcon from '@mui/icons-material/Publish'
import { Alert, Box, Stack, Typography, useMediaQuery } from '@mui/material'

import { ForumDetails } from '@/common/interfaces/forum'
import {
  PostAuthorDetails,
  PostFloor,
  Thread,
} from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import Link from '@/components/Link'
import Medals from '@/components/Medals'
import DigestAuthor from '@/components/Medals/DigestAuthor'
import { UserHtmlRenderer } from '@/components/RichText'
import { CenteredSnackbar, useSnackbar } from '@/components/Snackbar'
import UserCard from '@/components/UserCard'
import UserGroupIcon from '@/components/UserGroupIcon'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Footer from './Footer'
import PostComments from './PostComments'
import { PostExtraDetailsContainer } from './PostExtraDetails'
import PostRates from './PostRates'
import PostStatus from './PostStatus'
import ThreadCollections from './ThreadCollections'
import ThreadLikes from './ThreadLikes'
import PollExtension from './extension/Poll'
import {
  ReplyCreditBadge,
  ReplyCreditFloorLeft,
  ReplyCreditFloorRight,
} from './extension/ReplyCredit'
import { PostExtraDetailsEx } from './types'

function PostSubject({
  post,
  thread,
  forum,
}: {
  post: PostFloor
  thread?: Thread
  forum?: ForumDetails
}) {
  if (post.is_first) {
    const type =
      forum?.thread_types_map && thread?.type_id
        ? forum.thread_types_map[thread.type_id]
        : null
    return (
      <Stack direction="row" alignItems="center">
        {type?.name && (
          <Link
            to={
              forum &&
              pages.forum(
                forum?.fid,
                new URLSearchParams({ typeid: type.type_id.toString() })
              )
            }
            sx={{ flexShrink: 0 }}
          >
            <Chip text={type.name} size="large" />
          </Link>
        )}
        <Typography variant="h6">{post.subject}</Typography>
      </Stack>
    )
  }
  return <Typography fontWeight="bold">{post.subject}</Typography>
}

const Floor = ({
  children,
  threadControls,
  post,
  postDetails,
  threadDetails,
  forumDetails,
  firstInPage,
  onReply,
  onComment,
  onEdit,
}: {
  children: React.ReactNode
  threadControls?: React.ReactNode
  post: PostFloor
  postDetails?: PostExtraDetailsEx
  threadDetails?: Thread
  forumDetails?: ForumDetails
  firstInPage?: boolean
  onReply: (post: PostFloor) => void
  onComment: (post: PostFloor) => void
  onEdit: (post: PostFloor) => void
}) => {
  const gotoLink =
    post.position == 1 && post.is_first
      ? pages.thread(post.thread_id)
      : pages.goto(post.post_id)

  // 弹出框
  const {
    props: { open, onClose },
    show,
  } = useSnackbar()

  const narrowView = useMediaQuery('(max-width: 800px)')
  const thinView = useMediaQuery('(max-width: 560px)')

  return (
    <Box>
      <CenteredSnackbar open={open} autoHideDuration={3000} onClose={onClose}>
        <Alert severity="success">链接复制成功</Alert>
      </CenteredSnackbar>
      <Stack direction="row">
        {!narrowView && (
          <Stack
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode == 'light' ? '#D2E2FD' : '#42516d',
            })}
            width={192}
          >
            {firstInPage && threadDetails?.reply_credit && (
              <ReplyCreditFloorLeft threadDetails={threadDetails} />
            )}
            <PostAuthor post={post} />
          </Stack>
        )}
        <Stack className="flex-1" minWidth="1em">
          {firstInPage && threadDetails?.reply_credit && (
            <>
              {narrowView && (
                <ReplyCreditFloorLeft threadDetails={threadDetails} topBottom />
              )}
              <ReplyCreditFloorRight
                threadDetails={threadDetails}
                topBottom={narrowView}
              />
            </>
          )}
          {narrowView && <PostAuthorLandscape post={post} />}
          <Stack
            className="flex-1"
            px={thinView ? 1 : 2}
            pt={thinView ? 0 : 1.5}
            pb={0.5}
          >
            {post.position == 1 && !!post.is_first && (
              <PostSubject
                post={post}
                thread={threadDetails}
                forum={forumDetails}
              />
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              className="text-sm text-slate-300"
              mt={post.position == 1 && post.is_first ? 0.5 : undefined}
              mb={1}
            >
              <Stack direction="row">
                <Link color="inherit" underline="none" to={gotoLink}>
                  {chineseTime(post.dateline * 1000)}
                </Link>
                {threadControls}
              </Stack>
              <Stack direction="row" alignItems="center">
                <Link
                  color="inherit"
                  className="hover:text-blue-500"
                  mr={1}
                  to={gotoLink}
                  underline="hover"
                  onClick={(e) => {
                    e.preventDefault()
                    navigator.clipboard.writeText(
                      `${threadDetails?.subject} - 清水河畔\n${location.origin}${gotoLink}`
                    )
                    show('')
                  }}
                >
                  分享
                </Link>
                <Typography>
                  {post.pinned && (
                    <PublishIcon
                      htmlColor="#ff785b"
                      sx={{ verticalAlign: 'middle' }}
                    />
                  )}
                  #{post.position}
                </Typography>
              </Stack>
            </Stack>
            {(post.position > 1 || !post.is_first) && (
              <PostSubject
                post={post}
                thread={threadDetails}
                forum={forumDetails}
              />
            )}
            <PostStatus post={post} />
            {post.reply_credit_name && <ReplyCreditBadge post={post} />}
            {children}
            {post.position == 1 && !!post.is_first && (
              <PollExtension threadDetails={threadDetails} />
            )}
            {threadDetails && post.position == 1 && post.is_first == 1 && (
              <ThreadLikes
                tid={threadDetails.thread_id}
                values={[post.support, post.oppose]}
              />
            )}
            {threadDetails?.collections &&
              post.position == 1 &&
              post.is_first == 1 && (
                <ThreadCollections collections={threadDetails.collections} />
              )}
            <PostExtraDetailsContainer
              loading={!!post.has_comment && !postDetails}
              hasContent={
                !!postDetails?.comments?.length ||
                !!postDetails?.commentsRefresh
              }
            >
              <>
                {(postDetails?.comments || !!postDetails?.commentsRefresh) && (
                  <PostComments post={post} postDetails={postDetails} />
                )}
              </>
            </PostExtraDetailsContainer>
            <PostExtraDetailsContainer
              loading={!!post.has_rate && !postDetails}
              hasContent={
                !!postDetails?.rates?.length && !!postDetails?.rate_stat
              }
            >
              {postDetails?.rates && postDetails?.rate_stat && (
                <PostRates
                  rates={postDetails.rates}
                  rateStat={postDetails.rate_stat}
                />
              )}
            </PostExtraDetailsContainer>
            <Box flexGrow={1} />
            {!!post.usesig &&
              post.author_details?.signature &&
              post.message.length > 60 && (
                <Signature authorDetails={post.author_details} />
              )}
            <Footer
              forumDetails={forumDetails}
              threadDetails={threadDetails}
              post={post}
              onReply={() => onReply(post)}
              onComment={() => onComment(post)}
              onEdit={() => onEdit(post)}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

const PostAuthor = ({ post }: { post: PostFloor }) => {
  return (
    <Box px={2} py={2}>
      <UserCard item={post}>
        <AuthorLink post={post}>
          <Avatar
            className="m-auto"
            uid={post.is_anonymous || !post.author_details ? 0 : post.author_id}
            size={48}
          />
          <Typography variant="authorName" mt={0.5} component="p">
            {post.is_anonymous ? '匿名' : post.author}
          </Typography>
        </AuthorLink>
      </UserCard>
      {!!post.author_id && (
        <AuthorDetails
          author={post.author}
          authorDetails={post.author_details}
        />
      )}
    </Box>
  )
}

const PostAuthorLandscape = ({ post }: { post: PostFloor }) => {
  const thinView = useMediaQuery('(max-width: 560px)')
  return (
    <Box px={thinView ? 1 : 2} py={1}>
      <UserCard item={post}>
        <Stack direction="row">
          <AuthorLink post={post}>
            <Avatar
              className="m-auto"
              uid={
                post.is_anonymous || !post.author_details ? 0 : post.author_id
              }
              size={44}
            />
          </AuthorLink>
          <Stack
            ml={1}
            alignItems="flex-start"
            justifyContent="space-between"
            flexGrow={1}
            flexShrink={0}
          >
            <Stack direction="row">
              <AuthorLink post={post}>
                <Typography variant="authorName" component="p">
                  {post.is_anonymous ? '匿名' : post.author}
                </Typography>
              </AuthorLink>
              {!!post.author_details?.digests && (
                <Stack alignItems="flex-start" ml={0.5}>
                  <DigestAuthor username={post.author} sx={{ p: 0 }} />
                </Stack>
              )}
            </Stack>
            {!!post.author_id &&
              (post.author_details ? (
                <Stack direction="row">
                  <Chip text={post.author_details.group_title} />
                  {post.author_details.group_subtitle && (
                    <Typography variant="authorGroupSubtitle">
                      ({post.author_details.group_subtitle})
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="authorGroupSubtitle">
                  ( 该用户已删除 )
                </Typography>
              ))}
          </Stack>
          {!!post.author_details?.medals?.length && (
            <Stack ml={1} flexShrink={1} overflow="hidden">
              <Medals medals={post.author_details.medals} nowrap />
            </Stack>
          )}
        </Stack>
      </UserCard>
    </Box>
  )
}

const AuthorLink = ({
  post,
  children,
}: {
  post: PostFloor
  children?: ReactNode
}) =>
  post.author_id && post.author_details ? (
    <Link to={pages.user({ uid: post.author_id })} underline="hover">
      {children}
    </Link>
  ) : (
    <Box>{children}</Box>
  )

const AuthorDetails = ({
  author,
  authorDetails,
}: {
  author: string
  authorDetails?: PostAuthorDetails
}) =>
  authorDetails ? (
    <>
      {authorDetails.custom_title && (
        <Typography variant="authorCustomTitle" component="p">
          {authorDetails.custom_title}
        </Typography>
      )}
      <Stack alignItems="flex-start" mt={0.85}>
        <Box>
          <Typography variant="authorGroupTitle">
            <Typography variant="authorGroupTitlePrompt">级别：</Typography>
            {authorDetails.group_title}
          </Typography>
          {authorDetails.group_subtitle && (
            <Typography
              variant="authorGroupSubtitle"
              textAlign="right"
              component="p"
            >
              ( {authorDetails.group_subtitle} )
            </Typography>
          )}
        </Box>
      </Stack>
      <UserGroupIcon user={authorDetails} />
      {!!authorDetails.digests && (
        <Stack alignItems="flex-start" mb={1}>
          <DigestAuthor username={author} />
        </Stack>
      )}
      {!!authorDetails.medals?.length && (
        <Medals medals={authorDetails.medals} />
      )}
    </>
  ) : (
    <Typography variant="authorGroupSubtitle" textAlign="center">
      （该用户已删除）
    </Typography>
  )

const Signature = ({ authorDetails }: { authorDetails: PostAuthorDetails }) => {
  const thinView = useMediaQuery('(max-width: 560px)')
  if (authorDetails.signature && authorDetails.signature_format == 'html')
    return (
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          fontSize={12}
          pt={thinView ? 1 : 2}
          pb={0.25}
        >
          <Typography color="#7fcce5" fontSize={thinView ? 8 : 10} mr={0.5}>
            SIGNATURE
          </Typography>
          <Box sx={{ borderTop: '1px dashed #cccccc' }} flexGrow={1} />
          <Box flexGrow={1} />
        </Stack>
        <Box
          maxHeight={thinView ? 60 : 120}
          overflow="hidden"
          className="post-signature"
        >
          <UserHtmlRenderer html={authorDetails.signature} />
        </Box>
      </Stack>
    )
  return <></>
}

export default Floor
