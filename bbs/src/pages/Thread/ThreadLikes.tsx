import { ThumbDown, ThumbUp } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'

const threadLabelColors = ['#FF9A2E', '#6AA1FF']
const kLeftRight = ['Left', 'Right']
const padding = 7

const ThreadLikeMiddleHalf = ({
  index,
  borderRadius,
  values,
}: {
  index: number
  borderRadius: number
  values: [number, number]
}) => {
  const color = threadLabelColors[index]
  const D = kLeftRight[1 - index]
  const total = values[0] + values[1]
  const value = values[index]
  const widthRatio = value / total
  const normalWidth = `${100 * widthRatio}%`
  const reservedWidth = borderRadius + padding
  const largerHalf = widthRatio > 0.5
  const style = {
    [`padding${D}`]: `${padding}px`,
    backgroundColor: color,
    width: `calc(${normalWidth} + ${
      (largerHalf ? -1 : 1) * reservedWidth + (largerHalf ? borderRadius : 0)
    }px)`,
  }
  if (widthRatio > 0.5) {
    Object.assign(style, {
      [`margin${D}`]: `-${borderRadius}px`,
      [`borderTop${D}Radius`]: `${borderRadius}px`,
      [`borderBottom${D}Radius`]: `${borderRadius}px`,
      position: 'relative',
    })
  }
  return <Box sx={{ ...style }}></Box>
}

const ThreadLikeMiddlePart = ({
  borderRadius,
  values,
}: {
  borderRadius: number
  values: [number, number]
}) => {
  let a = values[0],
    b = values[1]
  if (a == 0 && b == 0) {
    a = b = 1
  }
  return (
    <Stack direction="row" flexGrow="1" flexShrink="1">
      <ThreadLikeMiddleHalf
        index={0}
        borderRadius={borderRadius}
        values={[a, b]}
      />
      <ThreadLikeMiddleHalf
        index={1}
        borderRadius={borderRadius}
        values={[a, b]}
      />
    </Stack>
  )
}

const ThreadLikeLabel = ({
  index,
  borderRadius,
  values,
}: {
  index: number
  borderRadius: number
  values: [number, number]
}) => {
  const color = threadLabelColors[index]
  const iconProps = { htmlColor: color }
  const D = kLeftRight[index]
  const style = {
    [`padding${D}`]: '7px',
    [`borderTop${D}Radius`]: `${borderRadius}px`,
    [`borderBottom${D}Radius`]: `${borderRadius}px`,
    backgroundColor: color,
  }
  return (
    <Stack
      direction="row"
      alignItems="center"
      flexGrow="0"
      flexShrink="0"
      sx={{ ...style }}
    >
      <Typography
        fontSize="20px"
        fontWeight="700"
        color="white"
        px={1}
        sx={{ order: index ? 1 : 0 }}
      >
        {values[index]}
      </Typography>
      <IconButton
        sx={{
          width: 38,
          height: 38,
          borderRadius: '100%',
          backgroundColor: 'white',
        }}
      >
        {index == 0 ? <ThumbUp {...iconProps} /> : <ThumbDown {...iconProps} />}
      </IconButton>
    </Stack>
  )
}
const ThreadLikes = ({ values }: { values: [number, number] }) => {
  const width = 300
  const height = 48
  const borderRadius = height / 2
  return (
    <Box>
      <Stack
        direction="row"
        width={width}
        height={height}
        borderRadius={borderRadius}
        mx="auto"
      >
        <ThreadLikeLabel
          index={0}
          borderRadius={borderRadius}
          values={values}
        />
        <ThreadLikeMiddlePart borderRadius={borderRadius} values={values} />
        <ThreadLikeLabel
          index={1}
          borderRadius={borderRadius}
          values={values}
        />
      </Stack>
    </Box>
  )
}

export default ThreadLikes
