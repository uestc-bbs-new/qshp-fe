import React, { useState } from 'react'

import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'

import { BetCompetition } from './api'

export const BetSubmitDialog = ({
  open,
  onClose,
  competition,
}: {
  open: boolean
  onClose: () => void
  competition: BetCompetition
}) => {
  const [submitPending, setSubmitPending] = useState(false)
  const [errorPrompt, setErrorPrompt] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const prepareSubmit = () => {}
  const handleSubmit = () => {}
  return (
    <>
      <Dialog open={open} onClose={() => onClose()}>
        <DialogTitle>
          <Typography variant="h5">{competition.title}</Typography>
        </DialogTitle>
        <DialogContent>
          {competition.options?.map((item, index) => (
            <React.Fragment key={index}>
              <Typography>
                {item.text} ({item.rate})
              </Typography>
            </React.Fragment>
          ))}
          {errorPrompt && (
            <Alert severity="error" sx={{ my: 1.5 }}>
              {errorPrompt}
            </Alert>
          )}
          <Stack direction="row" spacing="1em" mt={1.5}>
            <Button
              color="success"
              variant="contained"
              onClick={() => prepareSubmit()}
            >
              确认投注
            </Button>
            <Button variant="outlined" onClick={() => onClose()}>
              我再想想
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          <Typography variant="h6">确认投注信息</Typography>
          <Typography>请仔细核对投注信息：</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing="1em" mt={2}>
            <Button
              color="primary"
              variant="contained"
              disabled={submitPending}
              onClick={handleSubmit}
            >
              确认无误
            </Button>
            <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
              返回修改
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
