import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'

type DialogActionType = 'ok' | 'cancel'
type DialogActionVariant = 'dialogOk' | 'dialogCancel'

type DialogAction = {
  text?: string
  pendingText?: string
  onClick: () => Promise<void>
  type: DialogActionType
}

const variantMap: { [type in DialogActionType]: DialogActionVariant } = {
  ok: 'dialogOk',
  cancel: 'dialogCancel',
}

const defaultActionText = {
  ok: '确定',
  cancel: '取消',
}

export type DialogHandle = {
  ok: (e: object) => void
  cancel: (e: object) => void
}

type GeneralDialogProps = DialogProps & {
  titleText?: string
  children: React.ReactNode
  actions: DialogAction[]
}

const GeneralDialog = forwardRef<DialogHandle, GeneralDialogProps>(
  function GeneralDialog(
    { titleText, children, actions, open, onClose, ...props },
    ref
  ) {
    const [pending, setPending] = useState(false)

    const cancel = (e: object) => onClose && onClose(e, 'escapeKeyDown')
    const ok = (e: object) => {
      setPending(true)
      actions
        .find((item) => item.type == 'ok')
        ?.onClick()
        .then(() => cancel(e))
        .finally(() => setPending(false))
    }

    useImperativeHandle(
      ref,
      () => ({
        ok,
        cancel,
      }),
      []
    )

    useEffect(() => {
      if (!open) {
        setPending(false)
      }
    }, [open])

    return (
      <Dialog {...{ open, onClose }} {...props}>
        <DialogTitle
          sx={{
            borderBottom: '1px solid #E5E5E5',
            pt: 2.25,
            pb: 1.5,
            pl: 2.5,
            pr: 1.5,
            mb: 2,
          }}
        >
          <Stack direction="row" alignItems="center">
            <Stack direction="row" alignItems="center" flexGrow={1}>
              <Box
                mr={1.25}
                sx={{ width: 6, height: 29, backgroundColor: '#2175F3' }}
              />
              {titleText && (
                <Typography variant="dialogTitle">{titleText}</Typography>
              )}
            </Stack>
            <IconButton onClick={(e) => cancel(e)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {children}
          <Stack alignItems="center">
            {actions.map((item, index) => (
              <Button
                key={index}
                disabled={item.type == 'ok' ? pending : undefined}
                onClick={(e) => {
                  if (item.type == 'ok') {
                    ok(e)
                  } else if (item.type == 'cancel') {
                    cancel(e)
                  }
                }}
                variant={variantMap[item.type]}
              >
                {pending
                  ? item.pendingText || '请稍候...'
                  : item.text || defaultActionText[item.type]}
              </Button>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    )
  }
)

export default GeneralDialog
