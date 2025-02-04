import { Dialog, DialogTitle, Typography } from '@mui/material'

export const AdminSettingsDialog = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h5">管理</Typography>
      </DialogTitle>
    </Dialog>
  )
}
