import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material'

type Props = {
  isError: boolean
  error: any
  onRefresh?: () => void
}
const Error = ({ isError, error, onRefresh }: Props) => {
  return isError ? (
    <Alert
      severity="error"
      sx={{ alignItems: 'center' }}
      action={
        error.type == 'network' && onRefresh ? (
          <Stack alignItems="center">
            <Button onClick={onRefresh}>刷新</Button>
          </Stack>
        ) : null
      }
    >
      <AlertTitle>错误</AlertTitle>
      <Typography>
        {error.type == 'http'
          ? error.message
          : error.type == 'network'
          ? '网络不畅，请稍后刷新重试'
          : '系统错误'}
      </Typography>
    </Alert>
  ) : (
    <></>
  )
}

export default Error
