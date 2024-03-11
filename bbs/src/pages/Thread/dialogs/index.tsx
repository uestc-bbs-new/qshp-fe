import React from 'react'

import { Close } from '@mui/icons-material'
import { IconButton, Stack, Typography } from '@mui/material'

import { ForumDetails } from '@/common/interfaces/forum'
import { PostFloor, Thread } from '@/common/interfaces/response'
import DraggableDialog from '@/components/DraggableDialog'

import { ActionDialogType } from '../types'
import Comment from './Comment'
import EditOrReply from './EditOrReply'

const ActionDialog = ({
  currentDialog,
  open,
  onClose,
  post,
  forumDetails,
  threadId,
  threadDetails,
  onSubmitted,
  onComment,
}: {
  currentDialog: ActionDialogType
  open: boolean
  onClose?: () => void
  post: PostFloor
  forumDetails: ForumDetails
  threadId: number
  threadDetails: Thread
  onSubmitted: (action?: string, fromDialog?: boolean) => void
  onComment: () => void
}) => {
  return (
    <DraggableDialog
      disableRestoreFocus // Work around of bug https://github.com/mui/material-ui/issues/33004
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      DraggableProps={{ defaultClassName: 'draggable-with-vditor' }}
      sx={{
        '& > .MuiPaper-root': { maxHeight: '90%' },
        '& .draggable-with-vditor:has(.vditor--fullscreen)': {
          transform: 'none !important',
        },
      }}
      dialogTitle={
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>
            {
              { comment: '点评', reply: '回复', edit: '编辑' }[
                currentDialog || 'comment'
              ]
            }
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      }
      dialogTitleProps={{ sx: { pl: 2.5, pr: 1.5, py: 1 } }}
    >
      {currentDialog == 'comment' && (
        <Comment post={post} onCompleted={onComment} onClose={onClose} />
      )}
      {(currentDialog == 'reply' || currentDialog == 'edit') && (
        <EditOrReply
          mode={currentDialog}
          {...{
            post,
            forumDetails,
            threadId,
            threadDetails,
            onSubmitted,
          }}
        />
      )}
    </DraggableDialog>
  )
}

export default ActionDialog
