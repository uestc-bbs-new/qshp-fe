import React from 'react'

import { Button, CircularProgress, Stack } from '@mui/material'

import Error from '@/components/Error'
import GeneralDialog from '@/components/GeneralDialog'

export const LoadingDialog = ({
  open,
  onClose,
  titleText,
  children,
  isLoading,
  isError,
  error,
}: {
  open: boolean
  onClose?: () => void
  titleText: string
  children?: React.ReactNode
  isLoading: boolean
  isError: boolean
  error: any
}) => (
  <GeneralDialog
    open={open}
    onClose={onClose}
    titleText={titleText}
    actions={[]}
  >
    {isLoading ? (
      <Stack justifyContent="center" alignItems="center" px={10} py={6}>
        <CircularProgress />
      </Stack>
    ) : isError ? (
      <>
        <Error error={error} />
        <Stack direction="row" justifyContent="center" mt={2}>
          <Button variant="outlined" onClick={onClose}>
            返回
          </Button>
        </Stack>
      </>
    ) : (
      children
    )}
  </GeneralDialog>
)
