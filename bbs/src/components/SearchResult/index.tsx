import { useNavigate } from 'react-router-dom'

import { Face5, Poll, Textsms } from '@mui/icons-material'
import {
  Box,
  Divider,
  Chip as MuiChip,
  Stack,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { ForumDetails } from '@/common/interfaces/forum'
import { ThreadInList } from '@/common/interfaces/response'
import {
  kThreadDisplayOrderDeleted,
  kThreadDisplayOrderDraft,
  kThreadDisplayOrderInReview,
  kThreadDisplayOrderRejected,
} from '@/common/interfaces/thread'
import Chip from '@/components/Chip'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'
import Separated from '../Separated'
import ForumSmall from '../icons/ForumSmall'
import ReplySmall from '../icons/ReplySmall'
import { SummaryAttachments, SummaryText } from './Summary'

const formatNumber = (num: number) => {
  if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(1) + 'K'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  return num
}

export type SearchResultReplyItem = {
  post_id: number
  summary: string
}

type SearchResultItemProps = {
  data: ThreadInList
  forumDetails?: ForumDetails
  showSummary?: boolean
  replies?: SearchResultReplyItem[]
  hideThreadAuthor?: boolean
  ignoreThreadHighlight?: boolean
  fromForum?: boolean
}

const SearchResultItem = ({
  data,
  forumDetails,
  showSummary,
  replies,
  hideThreadAuthor,
  ignoreThreadHighlight,
  fromForum,
}: SearchResultItemProps) => {
  const theme = useTheme()
  const narrowView = useMediaQuery('(max-width: 750px)')
  const thinView = useMediaQuery('(max-width: 560px)')
  const to = pages.thread(data.thread_id)
  const navigate = useNavigate()

  return (
    <Box className="p-0.5">
      <Box
        p={thinView ? 1 : 1.75}
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
        onClick={narrowView ? () => navigate(to) : undefined}
      >
        {narrowView && !hideThreadAuthor && (
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" mb={1}>
              <SearchResultAvatar
                author_id={data.author_id}
                author={data.author}
                small
              />
              <SearchResultAuthor data={data} twoLines />
            </Stack>
            <SearchResultStatSmall result={data} />
          </Stack>
        )}
        <Stack direction="row">
          {!narrowView && !hideThreadAuthor && (
            <SearchResultAvatar
              author_id={data.author_id}
              author={data.author}
              small={showSummary}
            />
          )}
          <Box flexGrow={1}>
            <Box className="flex-1">
              <Stack direction="row" justifyContent="space-between">
                <Stack justifyContent="space-between" direction="column">
                  <Box mb={0.5}>
                    {!!data.type_id &&
                      forumDetails?.thread_types_map &&
                      forumDetails?.thread_types_map[data.type_id] && (
                        <Chip
                          text={
                            forumDetails?.thread_types_map[data.type_id].name
                          }
                          sx={{ flexShrink: 0, verticalAlign: 'middle' }}
                        />
                      )}
                    <Link
                      to={`/goto/${data.pid}`}
                      state={
                        fromForum && forumDetails
                          ? { fromForumId: forumDetails.fid }
                          : undefined
                      }
                      color="inherit"
                      underline="hover"
                      style={
                        ignoreThreadHighlight
                          ? undefined
                          : {
                              color: data.highlight_color,
                              backgroundColor: data.highlight_bgcolor,
                            }
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Typography
                        textAlign="justify"
                        variant="threadItemSubject"
                        color="inherit"
                        sx={{ verticalAlign: 'middle' }}
                        style={{
                          ...(!ignoreThreadHighlight && {
                            fontWeight: data.highlight_bold
                              ? 'bold'
                              : undefined,
                            fontStyle: data.highlight_italic
                              ? 'italic'
                              : undefined,
                            textDecoration: data.highlight_underline
                              ? 'underline'
                              : undefined,
                          }),
                          ...((data.display_order ==
                            kThreadDisplayOrderDeleted ||
                            data.display_order ==
                              kThreadDisplayOrderRejected) && {
                            textDecoration: 'line-through red 2px',
                            opacity: 0.8,
                          }),
                        }}
                      >
                        {data.subject}
                      </Typography>
                      <SearchResultExtraLabels data={data} />
                    </Link>
                  </Box>
                  <SearchResultRepliesOrComments
                    threadId={data.thread_id}
                    replies={replies}
                  />
                  {showSummary && (
                    <SummaryText
                      item={data}
                      sx={narrowView ? { opacity: 0.9 } : undefined}
                    />
                  )}
                </Stack>
                <Stack justifyContent="space-between" flexShrink={0} ml={0.5}>
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Stack direction="row" alignItems="center">
                            <ForumSmall
                              color={theme.typography.threadItemForum.color}
                            />
                            <Typography
                              ml={0.5}
                              mr={narrowView ? undefined : 2}
                            >
                              {data.forum_name}
                            </Typography>
                          </Stack>
                        </Link>
                      </>
                    )}
                    {!narrowView && (
                      <SearchResultStat
                        result={data}
                        sx={data.forum_name ? { minWidth: '14em' } : undefined}
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>
              {showSummary && <SummaryAttachments item={data} />}
            </Box>
            <Stack direction="row" justifyContent="space-between">
              {!narrowView && (
                <SearchResultAuthor
                  data={data}
                  hideThreadAuthor={hideThreadAuthor}
                />
              )}
              <Stack>
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          {data.last_poster || '匿名'}
                        </Link>
                      </>
                      <Link
                        color="inherit"
                        underline="hover"
                        to={pages.threadLastpost(data.thread_id)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {chineseTime(data.last_post * 1000)}
                      </Link>
                    </Separated>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            {narrowView && hideThreadAuthor && (
              <SearchResultStatSmall result={data} bottomView />
            )}
          </Box>
        </Stack>
      </Box>
      <Divider variant="fullWidth" style={{ backgroundColor: '#CAC4D0' }} />
    </Box>
  )
}

const SearchResultAvatar = ({
  author_id,
  author,
  small,
}: {
  author_id?: number
  author?: string
  small?: boolean
}) => {
  if (author_id == undefined) {
    return <></>
  }
  return (
    <Box sx={{ mr: 2 }}>
      <Link
        to={author_id ? `/user/${author_id}` : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar alt={author} uid={author_id} size={small ? 40 : 48} />
      </Link>
    </Box>
  )
}

const SearchResultStat = ({
  result,
  sx,
}: {
  result: Pick<ThreadInList, 'views' | 'replies' | 'recommends'>
  sx?: SxProps<Theme>
}) => (
  <Stack direction="row" justifyContent="flex-end" flexGrow={1} sx={sx}>
    <Typography variant="threadItemStat">
      <Separated
        separator={
          <Typography component="span" mx={0.75}>
            ·
          </Typography>
        }
      >
        <>查看：{formatNumber(result.views)}</>
        <>回复：{formatNumber(result.replies)}</>
        <>Stars: {formatNumber(result.recommends ?? 0)}</>
      </Separated>
    </Typography>
  </Stack>
)

const SearchResultStatSmall = ({
  result,
  bottomView,
}: {
  result: Pick<ThreadInList, 'views' | 'replies'>
  bottomView?: boolean
}) => {
  const iconSx = {
    fontSize: '0.95rem',
    ...(bottomView ? { mr: 0.5 } : { ml: 0.5, order: 1 }),
  }
  return (
    <Typography variant="threadItemAuthor">
      <Stack
        alignItems={bottomView ? 'center' : 'flex-end'}
        direction={bottomView ? 'row' : 'column'}
        spacing={bottomView ? 1 : undefined}
      >
        <Stack direction="row" alignItems="center">
          <Face5 sx={iconSx} />
          {result.views}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Textsms sx={iconSx} />
          {result.replies}
        </Stack>
      </Stack>
    </Typography>
  )
}

const SearchResultExtraLabels = ({ data }: { data: ThreadInList }) => (
  <>
    {!!data.reply_credit_remaining_amount && (
      <MuiChip
        label={
          <>
            回帖奖励
            <Typography fontWeight="bold" ml={0.5} component="span">
              {data.reply_credit_remaining_amount}
            </Typography>
          </>
        }
        variant="threadItemHot"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
    {data.special == 1 && (
      <Poll
        htmlColor="#FA541C"
        sx={{ width: '0.85em', mx: '0.25em', verticalAlign: 'middle' }}
      />
    )}
    {!!data.digest && (
      <MuiChip
        label="精华"
        variant="threadItemDigest"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
    {(data.stamp == 3 || data.icon == 12) && (
      <MuiChip
        label="优秀"
        variant="threadItemExcellent"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
    {(data.stamp == 5 || data.icon == 14) && (
      <MuiChip
        label="推荐"
        variant="threadItemRecommended"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
    {data.icon == 20 && (
      <MuiChip
        label="新人"
        variant="threadItemFreshman"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
    {data.display_order == kThreadDisplayOrderDraft && (
      <MuiChip
        label="草稿"
        variant="threadItemDraft"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
    {data.display_order == kThreadDisplayOrderInReview && (
      <MuiChip
        label="审核中"
        variant="threadItemReview"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
    {data.display_order == kThreadDisplayOrderRejected && (
      <MuiChip
        label="已忽略"
        variant="threadItemReview"
        sx={{ mx: 0.5, verticalAlign: 'middle' }}
      />
    )}
  </>
)

const SearchResultAuthor = ({
  data,
  hideThreadAuthor,
  twoLines,
}: {
  data: Pick<ThreadInList, 'author_id' | 'author' | 'dateline'>
  hideThreadAuthor?: boolean
  twoLines?: boolean
}) => {
  const time = <>{chineseTime(data.dateline * 1000)}</>
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="threadItemAuthor">
        {hideThreadAuthor ? (
          time
        ) : (
          <Separated
            separator={
              twoLines ? (
                <br />
              ) : (
                <Typography component="span" mx={0.75}>
                  ·
                </Typography>
              )
            }
          >
            <Link
              underline={data.author_id ? 'always' : 'none'}
              color={data.author_id ? undefined : 'inherit'}
              to={
                data.author_id ? pages.user({ uid: data.author_id }) : undefined
              }
              variant="threadItemAuthorLink"
              onClick={(e) => e.stopPropagation()}
            >
              {data.author}
            </Link>
            {time}
          </Separated>
        )}
      </Typography>
    </Stack>
  )
}

const SearchResultRepliesOrComments = ({
  threadId,
  replies,
}: {
  threadId: number
  replies?: SearchResultReplyItem[]
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
              onClick={(e) => e.stopPropagation()}
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

export default SearchResultItem
