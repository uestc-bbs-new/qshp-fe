import { Alert } from '@mui/material'

type Props = {
  isError: boolean
  error: any
}
const Error = ({ isError, error }: Props) => {
  return isError ? <Alert severity="error">{error.message}</Alert> : <></>
}

export default Error
