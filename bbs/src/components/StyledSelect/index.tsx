import { OutlinedInput, Select, SelectProps, styled } from '@mui/material'

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '8px',
    borderColor: theme.palette.mode === 'dark' ? '#7d7d7d' : '#D4E1FD',
  },
  '& .MuiOutlinedInput-root': {
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

export const StyledSelect = styled((props: SelectProps) => (
  <Select size="small" {...props} input={<StyledOutlinedInput notched />} />
))(({ theme }) => ({}))
