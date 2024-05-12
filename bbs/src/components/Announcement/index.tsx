import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import React, { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

import { Campaign } from '@mui/icons-material'
import { Box, Stack, SxProps, Typography, useTheme } from '@mui/material'

import { getIndexData } from '@/apis/common'
import { Announcement as AnnouncementItem } from '@/common/interfaces/response'
import { useAppState } from '@/states'

import Link from '../Link'

export const AnnouncementBox = ({
  children,
  sx,
  ...other
}: {
  children?: React.ReactNode
  sx?: SxProps
  mb?: number
  m?: number
  width?: string
}) => {
  const leftWidth = 48
  const theme = useTheme()
  return (
    <Box
      position="relative"
      {...other}
      sx={{
        position: 'relative',
        paddingLeft: `${leftWidth}px`,
        border: '2px solid black',
        borderColor: theme.palette.primary.main,
        ...sx,
      }}
    >
      {children}
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
}

export const AnnouncementBody = ({
  item,
  sx,
}: {
  item: AnnouncementItem
  sx?: SxProps
}) => {
  const theme = useTheme()
  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.background.paper,
        minHeight: '70px',
        ...sx,
      }}
      direction="row"
    >
      <Box className="p-4 flex-1 overflow-hidden">
        <Typography className="line-clamp-2">
          {item.title}
          <Link to={item.href} underline="none">
            【点我查看】
          </Link>
        </Typography>
      </Box>
    </Stack>
  )
}

const Announcement = () => {
  const theme = useTheme()
  const { state, dispatch } = useAppState()
  const matches = useMatches()
  useEffect(() => {
    if (
      matches.length &&
      matches[matches.length - 1].id != 'index' &&
      !state.announcement
    ) {
      getIndexData({ announcement: true }).then(
        (data) =>
          data.announcement &&
          dispatch({ type: 'set announcement', payload: data.announcement })
      )
    }
  }, [])

  if (state.announcement?.length) {
    return (
      <AnnouncementBox
        mb={1.75}
        sx={{
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
          loop={state.announcement.length > 1}
        >
          {state.announcement.map((item, index) => (
            <SwiperSlide key={index}>
              <AnnouncementBody item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </AnnouncementBox>
    )
  } else {
    return <></>
  }
}

export default Announcement
