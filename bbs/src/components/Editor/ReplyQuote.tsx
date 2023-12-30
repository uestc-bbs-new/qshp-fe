import { RefObject } from 'react'

import { Typography } from '@mui/material'

import { PostFloor } from '@/common/interfaces/response'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import { PostEditorValue } from './types'

const kMaxQuoteLineLength = 80

const ReplyQuote = ({
  post,
  valueRef,
}: {
  post: PostFloor
  valueRef?: RefObject<PostEditorValue>
}) => {
  let lines: string[] = []
  if (post.format == 0 || post.format == -1) {
    lines = post.message
      .replace(
        /^\[i=s\] 本帖最后由 (.+?) 于 (.+?) 编辑 \[\/i\]|\[quote\].*?\[\/quote\]/gs,
        ''
      )
      .replace(/\[.+?\]/g, '')
      .replace(/^\s+/, '')
      .split(/\r|\n|\r\n/, 3)
      .filter((line) => line.trim())
  } else {
    lines = post.message
      .replace(/^>\s.*/gm, '')
      .replace(/^\s+/, '')
      .split(/\r|\n|\r\n/, 3)
      .filter((line) => line.trim())
      .map((line) =>
        line
          .replace(/![.+?]\((?:s|a|i)\)|^#{1,3}\s|<.+?>/gm, '')
          .replace(/!?\[(.+?)\]\(.+?\)/g, '$1')
      )
  }
  lines = lines.map((line) =>
    line.length > kMaxQuoteLineLength
      ? `${line.substring(0, kMaxQuoteLineLength)}...` // TODO: Grapheme
      : line
  )
  if (lines.length == 0) {
    lines = ['...']
  }
  const postTime = chineseTime(post.dateline * 1000, { full: true })
  valueRef?.current &&
    (valueRef.current.quoteMessagePrepend = `> ${
      post.author
    } 发表于 [${postTime}](${pages.goto(post.post_id)})
${lines.map((line) => `> ${line}`).join('\n')}

`)

  return (
    <div className="rich-text-content">
      <blockquote>
        <Typography>
          {post.author} 发表于 {postTime}
        </Typography>
        {lines.map((line, index) => (
          <Typography key={index}>{line}</Typography>
        ))}
      </blockquote>
    </div>
  )
}
export default ReplyQuote
