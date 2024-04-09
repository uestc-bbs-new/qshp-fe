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
}) => (
  <Dialog open={open} onClose={onClose} fullScreen>
    <TransformWrapper>
      <TransformComponent>
        <Stack justifyContent="center" alignItems="center">
          {singleImage && <img src={singleImage.fullUrl} />}
        </Stack>
      </TransformComponent>
    </TransformWrapper>
    <IconButton
      sx={{ position: 'absolute', right: 10, top: 10 }}
      onClick={onClose}
    >
      <Close />
    </IconButton>
  </Dialog>
)

export default ImageViewDialog
