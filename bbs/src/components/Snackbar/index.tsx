import { useState } from 'react'

import { Snackbar, SnackbarProps } from '@mui/material'

export const CenteredSnackbar = (props: SnackbarProps) => (
  <Snackbar
    {...props}
    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
  />
)

export const useSnackbar = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  return {
    props: { open, onClose: () => setOpen(false) },
    message,
    show: (message: string) => {
      setMessage(message)
      setOpen(true)
    },
  }
}
