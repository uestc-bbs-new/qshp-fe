import { css } from '@emotion/react'

import { useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import { CircularProgress, Stack } from '@mui/material'

import { ImageItem } from './types'

const ImageView = ({
  onClose,
  singleImage,
}: {
  onClose?: () => void
  singleImage?: ImageItem
}) => {
  const fullSizeCss = { width: '100%', height: '100%' }
  const [panning, setPanning] = useState(false)
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && (
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
      )}
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
                onLoad={() => setLoaded(true)}
              />
            )}
          </Stack>
        </TransformComponent>
      </TransformWrapper>
    </>
  )
}

export default ImageView
