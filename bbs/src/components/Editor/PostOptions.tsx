import { MutableRefObject, useState } from 'react'

import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material'

import { ForumDetails } from '@/common/interfaces/forum'

import AttachmentManager from './AttachmentManager'
import ReplyCredit from './ReplyCredit'
import { VoteSelection } from './VoteSelection'
import { EditorAttachment, PostEditorKind, PostEditorValue } from './types'

const PostOptions = ({
  kind,
  forum,
  initialValue,
  valueRef,
  attachments,
  onUpdateAttachments,
  onAnonymousChanged,
}: {
  kind?: PostEditorKind
  forum?: ForumDetails
  initialValue?: PostEditorValue
  valueRef: MutableRefObject<PostEditorValue>
  attachments: EditorAttachment[]
  onUpdateAttachments: (newAttachments: EditorAttachment[]) => void
  onAnonymousChanged?: () => void
}) => {
  const [anonymous, setAnonymous] = useState(
    initialValue?.is_anonymous || false
  )
  return (
    <Box>
      {forum?.can_post_anonymously && (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymous}
                onChange={(e) => {
                  const checked = e.target.checked
                  setAnonymous(checked)
                  valueRef.current && (valueRef.current.is_anonymous = checked)
                  onAnonymousChanged && onAnonymousChanged()
                }}
              />
            }
            label="匿名发帖"
          />
        </FormGroup>
      )}
      {kind === 'newthread' && <VoteSelection valueRef={valueRef} />}
      {kind === 'newthread' && forum?.reply_credit && (
        <ReplyCredit status={forum.reply_credit} valueRef={valueRef} />
      )}
      {!!attachments?.length && (
        <AttachmentManager
          attachments={attachments}
          onUpdateAttachments={onUpdateAttachments}
          valueRef={valueRef}
        />
      )}
    </Box>
  )
}

export default PostOptions
