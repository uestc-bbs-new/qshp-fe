import { Button, Stack } from '@mui/material'

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
