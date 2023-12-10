import { ForumDetails, PostFloor } from '@/common/interfaces/response'
import { ParseLegacy } from '@/pages/Thread/ParserPost'

export const PostNotice = ({
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
  }
  if (forum?.post_notice_format == 'bbcode' && message) {
    // TODO(fangjue): Refactor rich text formatting in future commits.
    return <ParseLegacy post={{ message, format: 0 } as PostFloor} />
  }
  return <></>
}
