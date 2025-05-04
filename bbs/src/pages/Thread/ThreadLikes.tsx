import { useEffect, useState } from 'react'

import { ThumbDown, ThumbUp } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'

import { DEPRECATED_votePost } from '@/apis/thread'

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
  const reservedWidth = borderRadius // + padding
  const largerHalf = widthRatio > 0.5
  const style = {
    [`padding${D}`]: `${padding}px`,
    backgroundColor: color,
    width: `calc(${normalWidth} + ${
      (largerHalf ? -1 : 1) * reservedWidth +
      (largerHalf ? borderRadius + 0.5 : 0.5) // Add 0.5px to avoid 1px gap
    }px)`,
    transition: 'all 0.6s ease',
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
  const baseValue = 1
  // There are 4 threads in the database that have negative likes, which is very
  // strange and as a result we have to clamp value here.
  const a = Math.max(0, values[0] + baseValue)
  const b = Math.max(0, values[1] + baseValue)
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
  tid,
  index,
  borderRadius,
  values,
  onUpdate,
}: {
  tid: number
  index: number
  borderRadius: number
  values: [number, number]
  onUpdate: (likeDelta: number, dislikeDelta: number) => void
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
  const like = async () => {
    if (await DEPRECATED_votePost({ tid, support: index == 0 })) {
      onUpdate(index == 0 ? 1 : 0, index == 1 ? 1 : 0)
    }
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
        sx={{ order: index == 0 ? 1 : 0 }}
      >
        {values[index]}
      </Typography>
      <IconButton
        sx={{
          width: (38 / 24) * borderRadius,
          height: (38 / 24) * borderRadius,
          borderRadius: '100%',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#eee',
          },
        }}
        onClick={like}
      >
        {index == 0 ? <ThumbUp {...iconProps} /> : <ThumbDown {...iconProps} />}
      </IconButton>
    </Stack>
  )
}
const ThreadLikes = ({
  tid,
  values,
}: {
  tid: number
  values: [number, number]
}) => {
  const width = 300
  const height = 48
  const borderRadius = height / 2
  const [newValues, setNewValues] = useState(values)
  useEffect(() => {
    setNewValues(values)
  }, [values])
  const onUpdate = (likeDelta: number, dislikeDelta: number) => {
    const v: [number, number] = [...newValues]
    v[0] += likeDelta
    v[1] += dislikeDelta
    setNewValues(v)
  }

  return (
    <Stack
      direction="row"
      width={width}
      height={height}
      borderRadius={borderRadius}
      mx="auto"
      my={3}
    >
      <ThreadLikeLabel
        tid={tid}
        index={0}
        borderRadius={borderRadius}
        values={newValues}
        onUpdate={onUpdate}
      />
      <ThreadLikeMiddlePart borderRadius={borderRadius} values={newValues} />
      <ThreadLikeLabel
        tid={tid}
        index={1}
        borderRadius={borderRadius}
        values={newValues}
        onUpdate={onUpdate}
      />
    </Stack>
  )
}

export default ThreadLikes
