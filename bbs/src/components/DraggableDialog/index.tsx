import React from 'react'
import Draggable, { DraggableProps as IDraggableProps } from 'react-draggable'

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
  DraggableProps,
  ...props
}: PaperProps & {
  disabled?: boolean
  DraggableProps?: Partial<IDraggableProps>
}) => (
  <Draggable
    disabled={disabled}
    handle={`#${handleId}`}
    cancel={`[class*="MuiDialogContent-root"]`}
    {...DraggableProps}
  >
    <Paper {...props} />
  </Draggable>
)

type DraggableDialogProps = {
  dialogTitle: React.ReactNode
  dialogTitleProps?: DialogTitleProps
  children: React.ReactNode
  DraggableProps?: Partial<IDraggableProps>
}

const DraggableDialog = ({
  dialogTitle,
  dialogTitleProps,
  children,
  fullScreen,
  DraggableProps,
  ...props
}: DialogProps & DraggableDialogProps) => (
  <Dialog
    {...props}
    fullScreen={fullScreen}
    PaperComponent={DialogPaper}
    PaperProps={
      fullScreen || DraggableProps
        ? { disabled: !!fullScreen, DraggableProps }
        : undefined
    }
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
