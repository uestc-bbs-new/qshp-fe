import {
  Alert,
  AlertTitle,
  Button,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'

const Error = ({
  error,
  sx,
  onRefresh,
}: {
  error: any
  sx?: SxProps<Theme>
  onRefresh?: () => void
}) => {
  let message = error.message
  if (error.type == 'http') {
    if (error.status == 401) {
      message = '该页面需要登录后才能浏览。'
    } else {
      message = `HTTP ${error.status} ${error.statusText}`
    }
  } else if (error.type == 'network') {
    message = '网络不畅，请稍后刷新重试'
  } else if (!message) {
    message = '系统错误'
  }
  return (
    <Alert
      severity="error"
      sx={{ alignItems: 'center', ...sx }}
      action={
        error.type == 'network' && onRefresh ? (
          <Stack alignItems="center">
            <Button onClick={onRefresh}>刷新</Button>
          </Stack>
        ) : null
      }
    >
      <AlertTitle>错误</AlertTitle>
      <Typography>{message}</Typography>
    </Alert>
  )
}

export default Error
