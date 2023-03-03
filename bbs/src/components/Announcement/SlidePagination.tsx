import { Box, useTheme } from '@mui/material'

type Props = {
  index: number
  count: number
  setIndex: (number: number) => void
}

const PaginationDot = ({
  current,
  index,
  setIndex,
}: {
  current: number
  index: number
  setIndex: (number: number) => void
}) => {
  const theme = useTheme()
  return (
    <Box
      onClick={() => setIndex(index)}
      style={{
        backgroundColor:
          current === index
            ? theme.palette.primary.main
            : theme.palette.grey[300],
      }}
      className={`mx-1 rounded-lg transition-colors p-1 cursor-pointer`}
    ></Box>
  )
}

const SlidePagination = ({ index, count, setIndex }: Props) => {
  const children = []
  for (let i = 0; i < count; i++) {
    children.push(
      <PaginationDot setIndex={setIndex} key={i} current={index} index={i} />
    )
  }

  return (
    <Box className="flex absolute bottom-2 -translate-x-1/2 left-1/2">
      {children}
    </Box>
  )
}

export default SlidePagination
