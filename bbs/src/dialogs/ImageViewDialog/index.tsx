import { css } from '@emotion/react'

import { useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { Close } from '@mui/icons-material'
import { Dialog, IconButton, Stack } from '@mui/material'

type ImageItem = {
  fullUrl: string
}

const ImageViewDialog = ({
  open,
  onClose,
  singleImage,
}: {
  open: boolean
  onClose?: () => void
  singleImage?: ImageItem
}) => {
  const fullSizeCss = { width: '100%', height: '100%' }
  const [panning, setPanning] = useState(false)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
    >
      <TransformWrapper
        centerOnInit
        centerZoomedOut
        minScale={0.5}
        onPanningStart={() => setPanning(true)}
        onPanningStop={() => setPanning(false)}
      >
        <TransformComponent
          wrapperStyle={{ ...fullSizeCss }}
          contentStyle={{
            ...fullSizeCss,
            cursor: panning ? 'grabbing' : 'grab',
          }}
        >
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            {singleImage && (
              <img
                src={singleImage.fullUrl}
                css={css({
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '100%',
                })}
              />
            )}
          </Stack>
        </TransformComponent>
      </TransformWrapper>
      <IconButton
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          boxShadow: '0 0 32px rgba(0, 0, 0, 0.5)',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
    </Dialog>
  )
}

export default ImageViewDialog
