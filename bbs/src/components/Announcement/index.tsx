import { useQuery } from '@tanstack/react-query'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import React from 'react'

import { Campaign } from '@mui/icons-material'
import { Box, Stack, Typography, useTheme } from '@mui/material'

import { getAnnouncement } from '@/apis/common'
import { pages } from '@/utils/routes'

import Link from '../Link'

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

const Announcement = () => {
  const theme = useTheme()
  const { data } = useQuery({
    queryKey: ['announcement'],
    queryFn: () => getAnnouncement(),
  })

  const leftWidth = 48

  if (data?.length) {
    return (
      <Box
        className="relative"
        mb={1.75}
        sx={{
          paddingLeft: `${leftWidth}px`,
          border: '2px solid black',
          borderColor: theme.palette.primary.main,
          '--swiper-pagination-bottom': 0,
          '--swiper-pagination-bullet-size': '6px',
          '--swiper-theme-color': theme.palette.primary.main,
          '--swiper-pagination-bullet-inactive-color': '#ccc',
          '--swiper-pagination-bullet-inactive-opacity': 1,
        }}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          slidesPerView={1}
          loop
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <Slide tid={item.thread_id}>{item.subject}</Slide>
            </SwiperSlide>
          ))}
        </Swiper>
        <Stack
          position="absolute"
          justifyContent="center"
          alignItems="center"
          width={leftWidth}
          left={0}
          top={0}
          bottom={0}
          zIndex={1}
          sx={{
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Campaign fontSize="large" sx={{ color: theme.palette.grey[300] }} />
        </Stack>
      </Box>
    )
  } else {
    return <></>
  }
}

export default Announcement
