import { Stack } from '@mui/material'

import { ForumDetails } from '@/common/interfaces/forum'
import { PostFloor, Thread } from '@/common/interfaces/response'
import PostEditor from '@/components/Editor/PostEditor'

const EditOrReply = ({
  mode,
  post,
  forumDetails,
  threadId,
  threadDetails,
  onSubmitted,
}: {
  mode: 'edit' | 'reply'
  post: PostFloor
  forumDetails: ForumDetails
  threadId: number
  threadDetails: Thread
  onSubmitted: (action?: string, fromDialog?: boolean) => void
}) => {
  const getEditorInitialValue = (post: PostFloor, threadDetails?: Thread) => {
    return {
      subject: post.subject,
      message: post.message,
      format: post.format,
      smileyoff: post.smileyoff,
      is_anonymous: !!post.is_anonymous,
      ...(threadDetails && {
        type_id: threadDetails.type_id,
      }),
      ...(threadDetails?.poll && {
        poll: threadDetails.poll,
      }),
      attachments: post.attachments,
      editingThread: post.position == 1 && post.is_first == 1,
    }
  }

  return (
    <Stack px={2} pb={1.5} flexShrink={1}>
      <PostEditor
        kind={mode}
        smallAuthor
        autoFocus
        forum={forumDetails}
        threadId={threadId}
        postId={post?.post_id}
        replyPost={mode == 'reply' ? post : undefined}
        initialValue={
          mode == 'edit' && post
            ? getEditorInitialValue(
                post,
                post.position == 1 && post.is_first ? threadDetails : undefined
              )
            : undefined
        }
        onSubmitted={() => onSubmitted(mode, true)}
      />
    </Stack>
  )
}

export default EditOrReply
