import { useEffect, useRef, useState } from 'react'

import {
  ColorLens,
  FormatBold,
  InsertEmoticon,
  InsertLink,
  InsertPhoto,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Popover,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  debounce,
} from '@mui/material'

import { kSmilyBasePath } from '@/components/RichText/renderer'
import { smilyData } from '@/components/RichText/smilyData'
import { StyledField } from '@/components/StyledField'

const smilyScaleFactor = 0.8
const ProfileSign = () => {
  const [sign, setSign] = useState('之前的个人签名')
  const [color, setColor] = useState('')
  const [imageAnchorEl, setImageAnchorEl] = useState<null | HTMLElement>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageWidth, setImageWidth] = useState<number>(0)
  const [imageHeight, setImageHeight] = useState<number>(0)
  const [isFirstFocus, setIsFirstFocus] = useState<boolean>(true)
  const [linkAnchorEl, setLinkAnchorEl] = useState<null | HTMLElement>(null)
  const [linkUrl, setLinkUrl] = useState<string>('')
  const [linkText, setLinkText] = useState<string>('')
  const [smilyAnchorEl, setSmilyAnchorEl] = useState<null | HTMLElement>(null)
  const [smilyKind, setSmilyKind] = useState(smilyData[0])
  const [previewSign, setPreviewSign] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBoldButtonClick = () => {
    if (
      !inputRef.current ||
      !inputRef.current.selectionStart ||
      !inputRef.current.selectionEnd
    )
      return
    const newSign =
      sign.slice(0, inputRef.current.selectionStart) +
      '[b]' +
      sign.slice(
        inputRef.current.selectionStart,
        inputRef.current.selectionEnd
      ) +
      '[/b]' +
      sign.slice(inputRef.current.selectionEnd)
    setSign(newSign)
  }

  const handleClose = () => {
    setColor('')
    setImageAnchorEl(null)
    setImageUrl('')
    setImageWidth(0)
    setImageHeight(0)
    setIsFirstFocus(true)
    setLinkAnchorEl(null)
    setLinkUrl('')
    setLinkText('')
    setSmilyAnchorEl(null)
    setSmilyKind(smilyData[0])
  }
  const handleColorSelect = () => {
    if (color === '') return
    if (
      !inputRef.current ||
      !inputRef.current.selectionStart ||
      !inputRef.current.selectionEnd
    )
      return
    const newSign =
      sign.slice(0, inputRef.current.selectionStart) +
      `[color=${color}]` +
      sign.slice(
        inputRef.current.selectionStart,
        inputRef.current.selectionEnd
      ) +
      '[/color]' +
      sign.slice(inputRef.current.selectionEnd)
    setSign(newSign)
    handleClose()
  }

  const handleImageButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setImageAnchorEl(event.currentTarget)
  }
  const handleFirstFocusWidthOrHeight = () => {
    if (isFirstFocus) {
      setIsFirstFocus(false)
      const img = new Image()
      img.onload = () => {
        setImageWidth(img.width)
        setImageHeight(img.height)
      }
      img.src = imageUrl
    }
  }
  const handleImageUrlSubmit = () => {
    let newSign = ''
    if (
      !inputRef.current ||
      !inputRef.current.selectionStart ||
      !inputRef.current.selectionEnd
    )
      return
    if (imageWidth === 0 && imageHeight === 0) {
      newSign =
        sign.slice(0, inputRef.current.selectionStart) +
        `[img]${imageUrl}[/img]` +
        sign.slice(inputRef.current.selectionStart)
    } else {
      newSign =
        sign.slice(0, inputRef.current.selectionStart) +
        `[img=${imageWidth},${imageHeight}]${imageUrl}[/img]` +
        sign.slice(inputRef.current.selectionStart)
    }
    setSign(newSign)
    handleClose()
  }

  const handleLinkButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setLinkAnchorEl(event.currentTarget)
  }
  const handleLinkSubmit = () => {
    if (
      !inputRef.current ||
      !inputRef.current.selectionStart ||
      !inputRef.current.selectionEnd
    )
      return
    const newSign =
      sign.slice(0, inputRef.current.selectionStart) +
      `[url=${linkUrl}]${linkText}[/url]` +
      sign.slice(inputRef.current.selectionStart)
    setSign(newSign)
    handleClose()
  }

  const handleSmilyButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setSmilyAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    debounce(handlePreviewButtonClick, 400)()
  }, [sign])
  const handlePreviewButtonClick = () => {
    let previewSign = sign.replace(/\[b\]/g, '<b>')
    previewSign = previewSign.replace(/\[\/b\]/g, '</b>')
    previewSign = previewSign.replace(/\[color=(.*?)\]/g, '<font color="$1">')
    previewSign = previewSign.replace(/\[\/color\]/g, '</font>')
    previewSign = previewSign.replace(
      /\[img\](.*?)\[\/img\]/g,
      '<img src="$1" />'
    )
    previewSign = previewSign.replace(
      /\[img=(.*?),(.*?)\](.*?)\[\/img\]/g,
      '<img src="$3" width="$1" height="$2"/>'
    )
    previewSign = previewSign.replace(/\[\/img\]/g, '" />')
    previewSign = previewSign.replace(/\[url=(.*?)\]/g, '<a href="$1">')
    previewSign = previewSign.replace(/\[\/url\]/g, '</a>')
    previewSign = previewSign.replace(
      /\[s:(.*?)\]/g,
      (match, id) =>
        `<img src="${kSmilyBasePath}/${smilyKind.path}/${smilyKind.items.find(
          (item) => item.id == id
        )?.path}" loading="lazy" style="width: 50px; height: 50px;"/>`
    )
    previewSign = previewSign.replace(/\[\/s:(.*?)\]/g, '" />')
    setPreviewSign(previewSign)
  }

  return (
    <>
      <Stack direction="column" sx={{ width: '70%' }}>
        <Stack direction="row" spacing={-1}>
          <Tooltip title="文字加粗">
            <IconButton onClick={handleBoldButtonClick}>
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="设置文字颜色">
            <IconButton>
              <ColorLens />
              <input
                type="color"
                onChange={(event) => setColor(event.target.value)}
                onBlur={handleColorSelect}
                style={{
                  width: '37px',
                  height: '37px',
                  opacity: 0,
                  position: 'absolute',
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="图片">
            <IconButton onClick={handleImageButtonClick}>
              <InsertPhoto />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(imageAnchorEl)}
            anchorEl={imageAnchorEl}
            onClose={handleClose}
            disableScrollLock
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleImageUrlSubmit()
              }
            }}
          >
            <Box
              sx={{ mx: 3, my: 2 }}
              alignContent={'center'}
              justifyContent={'center'}
            >
              <Typography>请输入图片地址：</Typography>
              <TextField
                size="small"
                fullWidth
                onChange={(e) =>
                  setImageUrl((e.target as HTMLInputElement).value)
                }
              />
              <Stack direction={'row'} sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>宽（可选）：</Typography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '30px',
                        width: '80px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px',
                      },
                      mr: 1,
                    }}
                    value={imageWidth ? imageWidth : ''}
                    onChange={(e) =>
                      setImageWidth(
                        parseInt((e.target as HTMLInputElement).value)
                      )
                    }
                    onFocus={handleFirstFocusWidthOrHeight}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>高（可选）：</Typography>
                  <TextField
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '30px',
                        width: '80px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px',
                      },
                    }}
                    value={imageHeight ? imageHeight : ''}
                    onChange={(e) =>
                      setImageHeight(
                        parseInt((e.target as HTMLInputElement).value)
                      )
                    }
                    onFocus={handleFirstFocusWidthOrHeight}
                  />
                </Box>
              </Stack>
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleImageUrlSubmit}
              >
                提交
              </Button>
            </Box>
          </Popover>
          <Tooltip title="添加链接">
            <IconButton onClick={handleLinkButtonClick}>
              <InsertLink />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(linkAnchorEl)}
            anchorEl={linkAnchorEl}
            onClose={handleClose}
            disableScrollLock
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleLinkSubmit()
              }
            }}
          >
            <Box sx={{ mx: 3, my: 2, width: '300px' }}>
              <Typography>请输入链接地址：</Typography>
              <TextField
                size="small"
                fullWidth
                sx={{ mt: 0.5, mb: 1 }}
                onChange={(e) =>
                  setLinkUrl((e.target as HTMLInputElement).value)
                }
              />
              <Typography>请输入链接文字：</Typography>
              <TextField
                size="small"
                fullWidth
                sx={{ mt: 0.5 }}
                onChange={(e) =>
                  setLinkText((e.target as HTMLInputElement).value)
                }
              />
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleLinkSubmit}
              >
                提交
              </Button>
            </Box>
          </Popover>
          <Tooltip title="表情">
            <IconButton onClick={handleSmilyButtonClick}>
              <InsertEmoticon />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(smilyAnchorEl)}
            anchorEl={smilyAnchorEl}
            onClose={handleClose}
            disableScrollLock
          >
            <Box maxWidth={640}>
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={smilyKind}
                onChange={(_, newValue) => setSmilyKind(newValue)}
              >
                {smilyData.map((smilyKind, index) => (
                  <Tab
                    key={index}
                    label={smilyKind.name}
                    value={smilyKind}
                  ></Tab>
                ))}
              </Tabs>
              <Divider />
              <Grid
                key={smilyKind.id}
                container
                maxHeight="300px"
                overflow="auto"
                flexShrink={1}
                sx={{ ml: 1 }}
              >
                {smilyKind.items.map((item, index) => (
                  <Grid key={index} item>
                    <IconButton
                      onClick={() => {
                        if (inputRef.current === null) return
                        const selectionStart = inputRef.current.selectionStart!
                        const selectionEnd = inputRef.current.selectionEnd!
                        const newSign =
                          sign.slice(0, selectionStart) +
                          `[s:${item.id}]` +
                          sign.slice(selectionEnd)
                        setSign(newSign)
                        handleClose()
                      }}
                    >
                      <img
                        src={`${kSmilyBasePath}/${smilyKind.path}/${item.path}`}
                        loading="lazy"
                        style={{
                          width: `${item.width * smilyScaleFactor}px`,
                          height: `${Math.floor(
                            (item.thumbnailHeight / item.thumbnailWidth) *
                              item.width *
                              smilyScaleFactor
                          )}px`,
                        }}
                      />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Popover>
        </Stack>
        <StyledField
          multiline
          rows={5}
          value={sign}
          onChange={(e) => setSign(e.target.value)}
          inputRef={inputRef}
        />
        <div
          style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}
          dangerouslySetInnerHTML={{ __html: previewSign }}
        />
      </Stack>
    </>
  )
}
export default ProfileSign
