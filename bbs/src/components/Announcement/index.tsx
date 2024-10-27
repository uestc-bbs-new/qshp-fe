import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

import { Campaign } from '@mui/icons-material'
import {
  Box,
  Skeleton,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from '@mui/material'

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
  const theme = useTheme()
  return (
    <Stack
      direction="row"
      mb={1.75}
      border="2px solid"
      borderColor={theme.palette.primary.main}
      {...other}
      sx={sx}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        width={48}
        sx={{
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Campaign fontSize="large" sx={{ color: theme.palette.grey[300] }} />
      </Stack>
      {children}
    </Stack>
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
  const highlightColor = !item.highlight_color
    ? undefined
    : theme.palette.mode == 'dark'
      ? item.dark_highlight_color ?? item.highlight_color
      : item.highlight_color
  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.background.paper,
        minHeight: '70px',
        ...sx,
      }}
      direction="row"
    >
      <Box px={2} py={1} className="flex-1 overflow-hidden">
        <Link to={item.href} underline="none" color="inherit">
          <Typography
            fontSize={18}
            fontWeight="bold"
            sx={{ color: highlightColor }}
          >
            {item.title}
          </Typography>
        </Link>
        <Typography className="line-clamp-1" variant="threadItemSummary">
          {item.summary}
          <Link to={item.href} underline="none">
            【点我查看】
          </Link>
        </Typography>
      </Box>
    </Stack>
  )
}

const Announcement = ({ inSwiper }: { inSwiper?: boolean }) => {
  const theme = useTheme()
  const { state, dispatch } = useAppState()
  const matches = useMatches()
  useEffect(() => {
    if (
      matches.length &&
      matches[matches.length - 1].id != 'index' &&
      !state.announcement
    ) {
      getIndexData({ announcement: true }).then((data) =>
        dispatch({
          type: 'set announcement',
          payload: data.announcement || [],
        })
      )
    }
  }, [])

  if (!state.announcement) {
    return <Skeleton height={74} sx={{ mb: 1.75 }} />
  }
  if (!state.announcement.length) {
    return <></>
  }

  if (state.announcement?.length) {
    return (
      <AnnouncementBox
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
          nested={inSwiper}
          css={{ flexGrow: 1, flexShrink: 1 }}
        >
          {state.announcement.map((item, index) => (
            <SwiperSlide key={index}>
              <AnnouncementBody item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </AnnouncementBox>
    )
  }
}

export default Announcement
