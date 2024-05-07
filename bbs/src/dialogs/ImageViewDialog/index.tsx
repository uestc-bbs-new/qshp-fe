import React, { Suspense } from 'react'

import { Close } from '@mui/icons-material'
import { CircularProgress, Dialog, IconButton } from '@mui/material'

import { ImageItem } from './types'

const LazyImageView = React.lazy(() => import('./ImageView'))

const ImageViewDialog = ({
  open,
  onClose,
  singleImage,
}: {
  open: boolean
  onClose?: () => void
  singleImage?: ImageItem
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
    >
      <Suspense
        fallback={
          <CircularProgress
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              m: 'auto',
            }}
          />
        }
      >
        <LazyImageView {...{ onClose, singleImage }} />
      </Suspense>
      <IconButton
        sx={(theme) => ({
          position: 'absolute',
          right: 10,
          top: 10,
          boxShadow: '0 0 32px rgba(0, 0, 0, 0.5)',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'white',
          },
          color: theme.palette.mode == 'dark' ? '#333' : undefined,
        })}
        onClick={onClose}
      >
        <Close />
      </IconButton>
    </Dialog>
  )
}

export default ImageViewDialog
