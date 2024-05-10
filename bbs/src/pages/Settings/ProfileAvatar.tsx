import { useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
} from '@mui/material'

import Avatar from '@/components/Avatar'
import { useAppState } from '@/states'

const ProfileAvatar = () => {
  const { state } = useAppState()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [editor, setEditor] = useState<AvatarEditor | null>(null)
  const [scale, setScale] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imageType, setImageType] = useState<string | null>(null)

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    openDialog()
    if (e.target.files) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
      setImageType(file.type)
    }
  }
  const handleScaleChange = (event: Event, newValue: number | number[]) => {
    setScale(newValue as number)
  }
  const setEditorRef = (editor: AvatarEditor) => {
    setEditor(editor)
  }
  const openDialog = () => {
    setIsDialogOpen(true)
  }
  const closeDialog = () => {
    setIsDialogOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleButtonClick = () => {
    if (editor && imageType !== 'image/gif') {
      const sizes = [48, 120, 200]
      const images = sizes.map((size) => {
        const canvas = editor.getImageScaledToCanvas()
        const targetCanvas = document.createElement('canvas')
        targetCanvas.width = size
        targetCanvas.height = size
        const targetCtx = targetCanvas.getContext('2d')
        if (targetCtx) {
          targetCtx.drawImage(canvas, 0, 0, size, size)

          const imageData = targetCtx.getImageData(0, 0, size, size)
          const isTransparent = Array.from(imageData.data).some(
            (value, index) => index % 4 === 3 && value < 255
          )

          targetCanvas.toBlob(
            (blob) => {
              if (blob === null) return
              const url = URL.createObjectURL(blob)
              const img = new Image()
              img.src = url
            },
            isTransparent ? 'image/png' : 'image/jpeg'
          )
          const dataUrl = targetCanvas.toDataURL()
          return dataUrl
        }
      })
      // TODO: upload images
      console.log(images)
      closeDialog()
    }
    // TODO: upload gif
    //gif, scale and cropping rect
    if (editor && imageType === 'image/gif') {
      console.log('gif')
      console.log('Scale:', scale)
      console.log('Cropping rect:', editor.getCroppingRect())
    }
  }

  return (
    <>
      <Avatar
        uid={state.user.uid}
        size={100}
        onClick={handleAvatarClick}
        style={{ cursor: 'pointer' }}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif"
      />
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>编辑头像</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            alignContent="center"
            justifyContent="center"
            flexDirection="column"
          >
            {avatarUrl && (
              <AvatarEditor
                ref={setEditorRef}
                image={avatarUrl}
                width={250}
                height={250}
                border={60}
                color={[0, 0, 0, 0.5]}
                scale={scale}
              />
            )}
            <Slider
              value={scale}
              min={1}
              max={5}
              step={0.1}
              onChange={handleScaleChange}
              sx={{ my: 2 }}
            />
            <Button variant="contained" onClick={handleButtonClick}>
              确定
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProfileAvatar
