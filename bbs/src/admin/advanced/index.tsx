import { Button, TextField, Typography } from '@mui/material'

const Advanced = () => (
  <>
    <Typography variant="h4">设置 Cookie</Typography>
    <TextField multiline fullWidth rows={5} sx={{ my: 2 }} />
    <Button variant="outlined">确定</Button>
  </>
)
export default Advanced
