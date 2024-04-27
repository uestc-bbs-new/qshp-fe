import React, { forwardRef } from 'react'

import { TextField, styled } from '@mui/material'

import Back from './Back'

export const SignUpTextField = styled(TextField)(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode == 'light' ? '#F4F3F3' : '#999999',
    borderRadius: 8,
    fieldset: {
      border: 'none',
    },
  },
}))

type CommonFormProps = {
  title?: React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
}

export const CommonForm = forwardRef<HTMLFormElement, CommonFormProps>(
  function CommonForm({ title, children, onClose }: CommonFormProps, ref) {
    return (
      <form
        ref={ref}
        css={{
          width: '70%',
          '@media (max-width: 1200px)': {
            width: '80%',
          },
        }}
      >
        <Back onClick={onClose} />
        {title}
        <table
          css={{
            width: '100%',
            '& th': {
              textAlign: 'left',
              verticalAlign: 'top',
              paddingTop: '16.5px',
              width: '6em',
            },
          }}
        >
          <tbody>{children}</tbody>
        </table>
      </form>
    )
  }
)
