import React from 'react'
import Draggable from 'react-draggable'

import {
  Dialog,
  DialogProps,
  DialogTitle,
  Paper,
  PaperProps,
} from '@mui/material'

const handleId = 'draggable-dialog-handle'

const DialogPaper = (props: PaperProps) => (
  <Draggable
    handle={`#${handleId}`}
    cancel={`[class*="MuiDialogContent-root"]`}
  >
    <Paper {...props} />
  </Draggable>
)

type DraggableDialogProps = {
  title: React.ReactNode
  children: React.ReactNode
}

const DraggableDialog = ({
  title,
  children,
  ...props
}: DialogProps & DraggableDialogProps) => (
  <Dialog {...props} PaperComponent={DialogPaper} aria-labelledby={handleId}>
    <DialogTitle sx={{ cursor: 'move' }} id={handleId}>
      {title}
    </DialogTitle>
    {children}
  </Dialog>
)

export default DraggableDialog
