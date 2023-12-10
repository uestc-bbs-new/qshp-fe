import { TextField, TextFieldProps, styled } from '@mui/material'

export const StyledField = styled((props: TextFieldProps) => (
  <TextField size="small" {...props} />
))(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#7d7d7d' : '#D4E1FD',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark' ? '#D4E1FD' : '#7d7d7d',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark' ? '#95C9F8' : '#3A70F0',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#7281A7',
  },
}))
