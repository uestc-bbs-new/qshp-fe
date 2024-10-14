import { Box } from '@mui/material'

type Props = {
  src: string
  className?: string
  height?: number
  children?: React.ReactElement
}

const Banner = ({ src, className, height, children }: Props) => {
  return (
    <Box
      className={`bg-cover bg-center my-4 flex items-center justify-center ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        height: height ? `${height}px` : '120px',
        maxHeight: '200px',
      }}
    >
      {children}
    </Box>
  )
}

export default Banner
