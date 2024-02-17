import React, { useEffect, useState } from 'react'

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

type DialogAction<T> = {
  text?: string
  pendingText?: string
  onClick: () => Promise<T>
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

function GeneralDialog<T>({
  titleText,
  children,
  actions,
  open,
  onClose,
  ...props
}: DialogProps & {
  titleText?: string
  children: React.ReactNode
  actions: DialogAction<T>[]
}) {
  const [pending, setPending] = useState(false)

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
          <IconButton onClick={(e) => onClose && onClose(e, 'escapeKeyDown')}>
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
                  setPending(true)
                  item
                    .onClick()
                    .then(() => onClose && onClose(e, 'escapeKeyDown'))
                    .finally(() => setPending(false))
                } else if (item.type == 'cancel') {
                  onClose && onClose(e, 'escapeKeyDown')
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

export default GeneralDialog
