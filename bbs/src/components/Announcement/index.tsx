// TODO: this carousel component should be replaced due to long time no maintain
import { useQuery } from '@tanstack/react-query'

import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'

import { Campaign } from '@mui/icons-material'
import { Box, Stack, Typography, useTheme } from '@mui/material'

import { getAnnouncement } from '@/apis/common'
import { pages } from '@/utils/routes'

import Link from '../Link'
import SlidePagination from './SlidePagination'

type SlideProps = {
  children: React.ReactElement | string
  tid: number
}

const Slide = ({ children, tid }: SlideProps) => {
  const theme = useTheme()
  return (
    <Stack
      style={{
        backgroundColor: theme.palette.background.paper,
        minHeight: '70px',
      }}
      direction="row"
    >
      <Box
        className="p-2 flex items-center"
        style={{
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Campaign fontSize="large" sx={{ color: theme.palette.grey[300] }} />
      </Box>
      <Box className="p-4 flex-1 overflow-hidden">
        <Typography className="line-clamp-2">
          {children}
          <Link to={pages.thread(tid)} underline="none">
            【点我查看】
          </Link>
        </Typography>
      </Box>
    </Stack>
  )
}

const AutoPlay = autoPlay(SwipeableViews)

const Announcement = () => {
  const theme = useTheme()
  const [index, setIndex] = useState(0)
  const { data, refetch } = useQuery({
    queryKey: ['announcement'],
    queryFn: () => getAnnouncement(),
  })

  const handleIndexChange = (index: number) => {
    setIndex(index)
  }

  if (data) {
    console.log(data)
    return (
      <Box className="relative">
        <AutoPlay
          interval={5000}
          style={{
            border: '2px solid black',
            borderColor: theme.palette.primary.main,
          }}
          className="mb-4"
          index={index}
          onChangeIndex={handleIndexChange}
        >
          {data.map((item) => (
            <Slide key={item.thread_id} tid={item.thread_id}>
              {item.subject}
            </Slide>
          ))}
        </AutoPlay>
        <SlidePagination
          count={data.length}
          setIndex={handleIndexChange}
          index={index}
        />
      </Box>
    )
  } else {
    return <></>
  }
}

export default Announcement
