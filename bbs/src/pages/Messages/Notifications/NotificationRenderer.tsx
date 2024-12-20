import { Box, Typography } from '@mui/material'

import { Notification } from '@/common/interfaces/response'
import Link from '@/components/Link'
import { UserHtmlRenderer } from '@/components/RichText'
import { legacyPages, pages } from '@/utils/routes'

const NotificationRenderer = ({
  item,
  summary,
  small,
}: {
  item: Notification
  summary?: boolean
  small?: boolean
}) => {
  const fontWeightStyle = item.unread ? { fontWeight: 'bold' } : undefined
  const fontWeightProp = item.unread ? { fontWeight: 'bold' } : {}
  if ((item.kind == 'reply' || item.kind == 'comment') && item.post_id) {
    return (
      <Typography {...fontWeightProp}>
        <Link to={summary ? undefined : pages.user({ uid: item.author_id })}>
          {item.author}
        </Link>{' '}
        {item.kind == 'comment' ? '点评' : '回复'}了您的帖子：
        <Link to={pages.goto(item.post_id)}>{item.subject}</Link>
      </Typography>
    )
  }
  if (item.kind == 'at' && item.post_id) {
    return (
      <Typography
        {...fontWeightProp}
        sx={(theme) => ({
          '& blockquote': {
            whiteSpace: 'pre-wrap',
            // TODO: Refactor richtext.css with `css`.
            backgroundColor:
              theme.palette.mode == 'dark' ? '#454e5e' : 'rgb(241, 243, 250)',
            padding: '6px 15px',
            borderLeft: 'rgb(59, 115, 235) 2px solid',
            m: 0,
            my: 1,
          },
        })}
      >
        <Link to={summary ? undefined : pages.user({ uid: item.author_id })}>
          {item.author}
        </Link>
        {' 在 '}
        <Link to={pages.goto(item.post_id)}>{item.subject}</Link> 中提到了您：
        <blockquote>{item.summary}</blockquote>
      </Typography>
    )
  }
  if (item.kind == 'thread_collect') {
    return (
      <Typography {...fontWeightProp}>
        恭喜您的主题{' '}
        <Link to={item.thread_id ? pages.thread(item.thread_id) : undefined}>
          {item.subject}
        </Link>{' '}
        被
        {!!item.author_id && (
          <>
            {' '}
            <Link to={pages.user({ uid: item.author_id })}>
              {item.author}
            </Link>{' '}
          </>
        )}
        收录至公共收藏夹（淘专辑）
        <Link
          external
          target="_blank"
          to={
            item.collection_id
              ? legacyPages.collection(item.collection_id)
              : undefined
          }
        >
          {item.collection_name}
        </Link>
        ！
      </Typography>
    )
  }
  return (
    <Box sx={small ? { '& .quote blockquote': { mt: 0.5, mb: 0 } } : undefined}>
      <UserHtmlRenderer html={item.html_message} style={fontWeightStyle} />
    </Box>
  )
}

export const getNotificationTarget = (item: Notification) => {
  if (
    (item.kind == 'reply' || item.kind == 'comment' || item.kind == 'at') &&
    item.post_id
  ) {
    return pages.goto(item.post_id)
  }
  if (item.kind == 'thread_collect' && item.thread_id) {
    return pages.thread(item.thread_id)
  }
}

export default NotificationRenderer
