import { Button, Stack } from '@mui/material'

type FooterProps = {
  floor: number
  set_reply: (data: number) => void
}

const Footer = ({ floor, set_reply }: FooterProps) => {
  const handleReplyClick = () => {
    window.location.hash = 'vditor'
    set_reply(floor)
  }
  return (
    <Stack direction="row" className="justify-end">
      <Button variant="text" className="mr-2">
        收藏
      </Button>
      <Button variant="text" onClick={handleReplyClick}>
        回复
      </Button>
    </Stack>
  )
}

export default Footer
