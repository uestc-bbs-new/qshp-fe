import { Fragment, useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

type ButtonType =
  | 'garbage'
  | 'illegal'
  | 'pornography'
  | 'discomfort'
  | 'misinformation'
  | 'other'

const Report = ({ selectedCount }: { selectedCount: number }) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const [buttonVariant, setButtonVariant] = useState<
    Record<ButtonType, string>
  >({
    garbage: 'outlined',
    illegal: 'outlined',
    pornography: 'outlined',
    discomfort: 'outlined',
    misinformation: 'outlined',
    other: 'outlined',
  })

  const handleButtonClick = (type: ButtonType) => {
    const newButtonVariant: Record<ButtonType, string> = { ...buttonVariant }
    newButtonVariant[type] =
      buttonVariant[type] === 'outlined' ? 'contained' : 'outlined'
    if (newButtonVariant[type] === 'contained') {
      Object.keys(newButtonVariant).forEach((key) => {
        if (key !== type) {
          newButtonVariant[key as ButtonType] = 'outlined'
        }
      })
    }
    setButtonVariant(newButtonVariant)
  }

  return (
    <Fragment>
      {/* 点击按钮打开对话框 */}
      <Button
        sx={(theme) => ({
          color: theme.palette.mode == 'light' ? '#0268FD' : '#90CAF9',
        })}
        disabled={selectedCount !== 1}
        onClick={handleClickOpen}
      >
        <span style={{ marginRight: '6px' }}>举报</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          //需要注意一下，这里还需要修改！
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries((formData as any).entries())
            const email = formJson.email
            console.log(email)
            handleClose()
          },
        }}
      >
        <DialogTitle style={{ fontWeight: 'bold', color: '#2175F3' }}>
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '14px',
              backgroundColor: '#2175F3',
              marginRight: '4px',
            }}
          ></span>
          举报
        </DialogTitle>
        <DialogContent>
          <Stack sx={{ width: 320, marginBottom: 1 }}>
            <Typography variant="h6" gutterBottom>
              请选择举报类型*
            </Typography>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', marginBottom: 1 }}
            >
              <Button
                variant={buttonVariant.garbage as 'outlined' | 'contained'}
                sx={{ width: '100px' }}
                onClick={() => handleButtonClick('garbage')}
              >
                垃圾广告
              </Button>
              <Button
                variant={buttonVariant.illegal as 'outlined' | 'contained'}
                sx={{ width: '100px' }}
                onClick={() => handleButtonClick('illegal')}
              >
                违法违规
              </Button>
              <Button
                variant={buttonVariant.pornography as 'outlined' | 'contained'}
                sx={{ width: '100px' }}
                onClick={() => handleButtonClick('pornography')}
              >
                色情低俗
              </Button>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Button
                variant={buttonVariant.discomfort as 'outlined' | 'contained'}
                sx={{ width: '100px' }}
                onClick={() => handleButtonClick('discomfort')}
              >
                引人不适
              </Button>
              <Button
                variant={
                  buttonVariant.misinformation as 'outlined' | 'contained'
                }
                sx={{ width: '100px' }}
                onClick={() => handleButtonClick('misinformation')}
              >
                不实信息
              </Button>
              <Button
                variant={buttonVariant.other as 'outlined' | 'contained'}
                sx={{ width: '100px' }}
                onClick={() => handleButtonClick('other')}
              >
                其它原因
              </Button>
            </Stack>
          </Stack>
          <Typography variant="h6" gutterBottom>
            请填写举报内容
          </Typography>
          <TextField
            fullWidth
            placeholder="可输入200个字符，举报后站长将会看到相关的全部记录"
            multiline
            rows={5}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消举报</Button>
          <Button type="submit">确定</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default Report
