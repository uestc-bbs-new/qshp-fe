import React, { Suspense } from 'react'

import { Close } from '@mui/icons-material'
import { Button, CircularProgress, Dialog, IconButton } from '@mui/material'

import Link from '@/components/Link'
import { ImageViewDetails } from '@/states/reducers/stateReducer'

const LazyImageView = React.lazy(() => import('./ImageView'))

const ImageViewDialog = ({
  open,
  onClose,
  details,
}: {
  open: boolean
  onClose?: () => void
  details?: ImageViewDetails
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
        <LazyImageView {...{ onClose, singleImage: details?.images[0] }} />
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
      <Button
        variant="contained"
        component={Link}
        href={details?.images[0]?.raw_url ?? details?.images[0]?.path}
        download={details?.images[0]?.filename}
        target="_blank"
        sx={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          boxShadow: '0 0 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        下载原图
      </Button>
    </Dialog>
  )
}

export default ImageViewDialog
