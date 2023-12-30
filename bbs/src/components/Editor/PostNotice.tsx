import { Box } from '@mui/material'

import { ForumDetails } from '@/common/interfaces/response'

import { RichTextRenderer } from '../RichText'

const PostNotice = ({
  forum,
  position,
  mobile,
  quick,
}: {
  forum?: ForumDetails
  position: string
  mobile?: boolean
  quick?: boolean
}) => {
  let message = ''
  if (forum?.post_notice) {
    const p = forum.post_notice
    switch (position) {
      case 'newthread':
        message = mobile
          ? p.newthread_mobile
          : quick
            ? p.newthread_quick
            : p.newthread
        break
      case 'reply':
        if (mobile) {
          message = quick ? p.reply_quick_mobile : p.reply_mobile
        } else {
          message = quick ? p.reply_quick : p.reply
        }
        break
      case 'editthread':
        message = mobile ? p.editthread_mobile : p.editthread
        break
      case 'poll':
        message = p.poll
        break
    }
    if (message.trim()) {
      return (
        <Box mb={2}>
          <RichTextRenderer
            message={message}
            format={forum.post_notice_format}
          />
        </Box>
      )
    }
  }
  return <></>
}

export default PostNotice
