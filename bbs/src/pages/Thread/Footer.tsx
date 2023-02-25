import React from 'react'

import { Stack, Button } from '@mui/material'

type FooterProps = {
  floor: number
}

const Footer = ({ floor }: FooterProps) => {
  const handleReplyClick = () => {
    console.log(floor)
    window.location.hash = 'vditor'
  }
  return (
    <Stack direction="row" className="justify-end">
      <Button>喜欢</Button>
      <Button onClick={handleReplyClick}>回复</Button>
    </Stack>
  )
}

export default Footer
