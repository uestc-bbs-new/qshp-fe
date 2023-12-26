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
  dialogTitle: React.ReactNode
  children: React.ReactNode
}

const DraggableDialog = ({
  dialogTitle,
  children,
  ...props
}: DialogProps & DraggableDialogProps) => (
  <Dialog {...props} PaperComponent={DialogPaper} aria-labelledby={handleId}>
    <DialogTitle sx={{ cursor: 'move' }} id={handleId}>
      {dialogTitle}
    </DialogTitle>
    {children}
  </Dialog>
)

export default DraggableDialog
