import React from 'react'

import { Poll } from '@mui/icons-material'
import {
  Box,
  Divider,
  Chip as MuiChip,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { ForumBasics, ForumDetails } from '@/common/interfaces/forum'
import {
  Thread,
  ThreadInList,
  TopListKey,
  TopListThread,
} from '@/common/interfaces/response'
import Chip from '@/components/Chip'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'
import Separated from '../Separated'
import ForumSmall from '../icons/ForumSmall'
import ReplySmall from '../icons/ReplySmall'
import Summary from './Summary'

const formatNumber = (num: number) => {
  if (num >= 1000 && num < 1000000) {
    const formattedNum = (num / 1000).toFixed(1) + 'K'
    return formattedNum
  } else if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1) + 'M'
    return formattedNum
  }
  return num
}

export type ThreadReplyOrCommentItem = {
  post_id: number
  summary: string
}

type ThreadItemProps = {
  data: ThreadInList
  forum?: ForumBasics
  forumDetails?: ForumDetails
  showSummary?: boolean
  replies?: ThreadReplyOrCommentItem[]
  hideThreadAuthor?: boolean
  ignoreThreadHighlight?: boolean
}

const ThreadItem = ({
  data,
  forumDetails,
  showSummary,
  replies,
  hideThreadAuthor,
  ignoreThreadHighlight,
}: ThreadItemProps) => {
  const theme = useTheme()

  return (
    <Box className="p-0.5">
      <Box
        className="p-4"
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row">
          {!hideThreadAuthor && data.author_id !== undefined && (
            <Box sx={{ mr: 2 }}>
              <Link to={data.author_id ? `/user/${data.author_id}` : undefined}>
                <Avatar
                  alt={data.author}
                  uid={data.author_id}
                  size={showSummary ? 40 : 48}
                />
              </Link>
            </Box>
          )}
          <Box className="flex-1" mr={1.5}>
            <Stack
              justifyContent="space-between"
              direction="column"
              sx={{ minWidth: 350 }}
            >
              <Stack direction="row" alignItems="center" mb={0.5}>
                {!!data.type_id &&
                  forumDetails?.thread_types_map &&
                  forumDetails?.thread_types_map[data.type_id] && (
                    <Chip
                      text={forumDetails?.thread_types_map[data.type_id].name}
                    />
                  )}
                <Link
                  to={pages.thread(data.thread_id)}
                  color="inherit"
                  underline="hover"
                  className="line-clamp-2"
                >
                  <Typography
                    textAlign="justify"
                    variant="threadItemSubject"
                    color={ignoreThreadHighlight ? 'primary' : undefined}
                    style={
                      ignoreThreadHighlight
                        ? undefined
                        : {
                            color: data.highlight_color,
                            backgroundColor: data.highlight_bgcolor,
                            fontWeight: data.highlight_bold
                              ? 'bold'
                              : undefined,
                            fontStyle: data.highlight_italic
                              ? 'italic'
                              : undefined,
                            textDecoration: data.highlight_underline
                              ? 'underline'
                              : undefined,
                          }
                    }
                  >
                    {data.subject}
                  </Typography>
                </Link>
                <ThreadExtraLabels thread={data} />
              </Stack>
              <ThreadRepliesOrComments
                threadId={data.thread_id}
                replies={replies}
              />
              {showSummary && <Summary item={data} />}
              <ThreadAuthor thread={data} hideThreadAuthor={hideThreadAuthor} />
            </Stack>
          </Box>
          <Stack justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              {data.forum_name && (
                <>
                  <Box flexGrow={1} />
                  <Link
                    to={pages.forum(data.forum_id)}
                    underline="hover"
                    color=""
                    variant="threadItemForum"
                    sx={{
                      '&:hover': {
                        color: '#2175F3',
                        'svg path.fill': {
                          fill: '#2175F3',
                        },
                        'svg path.stroke': {
                          stroke: '#2175F3',
                        },
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center">
                      <ForumSmall
                        color={theme.typography.threadItemForum.color}
                      />
                      <Typography ml={0.5} mr={2}>
                        {data.forum_name}
                      </Typography>
                    </Stack>
                  </Link>
                </>
              )}
              <Stack
                direction="row"
                justifyContent="flex-end"
                flexGrow={1}
                minWidth={data.forum_name ? '14em' : undefined}
              >
                <Typography variant="threadItemStat">
                  <Separated
                    separator={
                      <Typography component="span" mx={0.75}>
                        ·
                      </Typography>
                    }
                  >
                    <>查看：{formatNumber(data.views)}</>
                    <>回复：{formatNumber(data.replies)}</>
                  </Separated>
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="flex-end">
              <Typography variant="threadItemAuthor">
                <Separated
                  separator={
                    <Typography component="span" mx={0.75}>
                      ·
                    </Typography>
                  }
                >
                  <>
                    {`最新回复：`}
                    <Link
                      color="inherit"
                      underline={data.last_poster ? 'hover' : 'none'}
                      to={
                        data.last_poster
                          ? pages.user({ username: data.last_poster })
                          : undefined
                      }
                    >
                      {data.last_poster || '匿名'}
                    </Link>
                  </>
                  <>{chineseTime(data.last_post * 1000)}</>
                </Separated>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Divider variant="fullWidth" style={{ backgroundColor: '#CAC4D0' }} />
    </Box>
  )
}

export const ThreadItemLite = ({
  item,
  fromTopList,
}: {
  item: TopListThread
  fromTopList?: TopListKey
}) => {
  return (
    <Box px={0.25} py={0.5}>
      <Stack direction="row" alignItems="center">
        <Link to={item.author_id ? `/user/${item.author_id}` : undefined}>
          <Avatar alt={item.author} uid={item.author_id} size={30} />
        </Link>
        <Link
          to={pages.thread(item.thread_id)}
          {...(fromTopList && { state: { fromTopList } })}
          color="inherit"
          underline="hover"
          className="line-clamp-3"
          ml={1.2}
        >
          {item.label && <Chip text={item.label} />}
          <Typography
            textAlign="justify"
            component="span"
            sx={{ verticalAlign: 'middle' }}
          >
            {item.subject}
          </Typography>
        </Link>
      </Stack>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        className="text-sm"
        pl={0.5}
      >
        <Link
          to={item.author_id ? pages.user({ uid: item.author_id }) : undefined}
        >
          {item.author}
        </Link>
        <Typography fontSize="inherit" className="pl-1" color="grey">
          {`· ${chineseTime(item.dateline * 1000, { short: true })}`}
        </Typography>
      </Stack>
    </Box>
  )
}

const ThreadExtraLabels = ({ thread }: { thread: Partial<Thread> }) => (
  <>
    {!!thread.reply_credit_remaining_amount && (
      <MuiChip
        label={
          <>
            回帖奖励
            <Typography fontWeight="bold" ml={0.5} component="span">
              {thread.reply_credit_remaining_amount}
            </Typography>
          </>
        }
        variant="threadItemHot"
        sx={{ mx: 0.5 }}
      />
    )}
    {thread.special == 1 && (
      <Poll htmlColor="#FA541C" sx={{ width: '0.85em', mx: '0.25em' }} />
    )}
    {!!thread.digest && (
      <MuiChip label="精华" variant="threadItemDigest" sx={{ mx: 0.5 }} />
    )}
    {(thread.stamp == 3 || thread.icon == 12) && (
      <MuiChip label="优秀" variant="threadItemExcellent" sx={{ mx: 0.5 }} />
    )}
    {(thread.stamp == 5 || thread.icon == 14) && (
      <MuiChip label="推荐" variant="threadItemRecommended" sx={{ mx: 0.5 }} />
    )}
    {thread.icon == 20 && (
      <MuiChip label="新人" variant="threadItemFreshman" sx={{ mx: 0.5 }} />
    )}
  </>
)

const ThreadAuthor = ({
  thread,
  hideThreadAuthor,
}: {
  thread: Partial<Thread> & Required<Pick<Thread, 'dateline'>>
  hideThreadAuthor?: boolean
}) => {
  const time = <>{chineseTime(thread.dateline * 1000)}</>
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="threadItemAuthor">
        {hideThreadAuthor ? (
          time
        ) : (
          <Separated
            separator={
              <Typography component="span" mx={0.75}>
                ·
              </Typography>
            }
          >
            <Link
              underline={thread.author_id ? 'always' : 'none'}
              color={thread.author_id ? undefined : 'inherit'}
              to={
                thread.author_id
                  ? pages.user({ uid: thread.author_id })
                  : undefined
              }
              variant="threadItemAuthorLink"
            >
              {thread.author}
            </Link>
            {time}
          </Separated>
        )}
      </Typography>
    </Stack>
  )
}

const ThreadRepliesOrComments = ({
  threadId,
  replies,
}: {
  threadId: number
  replies?: ThreadReplyOrCommentItem[]
}) =>
  replies?.length ? (
    <Box mb={0.5}>
      <Separated separator={<Divider sx={{ ml: 2.5 }} />}>
        {replies.map((item, index) => (
          <Stack direction="row" key={index}>
            <ReplySmall style={{ flexShrink: 0 }} />
            <Link
              to={pages.goto(item.post_id)}
              underline="hover"
              ml={0.5}
              my={0.25}
            >
              <Typography variant="threadItemSummary">
                {item.summary}
              </Typography>
            </Link>
          </Stack>
        ))}
      </Separated>
    </Box>
  ) : (
    <></>
  )

export default ThreadItem
