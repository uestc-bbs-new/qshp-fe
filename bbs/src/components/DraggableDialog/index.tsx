import React from 'react'
import Draggable from 'react-draggable'

import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  Paper,
  PaperProps,
} from '@mui/material'

const handleId = 'draggable-dialog-handle'

const DialogPaper = ({
  disabled,
  ...props
}: PaperProps & { disabled?: boolean }) => (
  <Draggable
    disabled={disabled}
    handle={`#${handleId}`}
    cancel={`[class*="MuiDialogContent-root"]`}
  >
    <Paper {...props} />
  </Draggable>
)

type DraggableDialogProps = {
  dialogTitle: React.ReactNode
  dialogTitleProps?: DialogTitleProps
  children: React.ReactNode
}

const DraggableDialog = ({
  dialogTitle,
  dialogTitleProps,
  children,
  fullScreen,
  ...props
}: DialogProps & DraggableDialogProps) => (
  <Dialog
    {...props}
    fullScreen={fullScreen}
    PaperComponent={DialogPaper}
    PaperProps={fullScreen ? { disabled: true } : undefined}
    aria-labelledby={handleId}
  >
    <DialogTitle
      {...dialogTitleProps}
      sx={{ ...dialogTitleProps?.sx, ...(!fullScreen && { cursor: 'move' }) }}
      id={handleId}
    >
      {dialogTitle}
    </DialogTitle>
    {children}
  </Dialog>
)

export default DraggableDialog
