import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'

import { useEffect, useRef, useState } from 'react'
import { useMatches } from 'react-router-dom'

import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Campaign,
  More,
} from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Stack,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { getIndexData } from '@/apis/common'
import { Announcement as AnnouncementItem } from '@/common/interfaces/response'
import { useAppState } from '@/states'

import GeneralDialog from '../GeneralDialog'
import Link from '../Link'

export const AnnouncementBox = ({
  children,
  sx,
  onMoreClick,
  ...other
}: {
  children?: React.ReactNode
  sx?: SxProps
  mb?: number
  m?: number
  width?: string
  onMoreClick?: () => void
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
        flexGrow={0}
        flexShrink={0}
        sx={{
          backgroundColor: theme.palette.primary.main,
        }}
        onClick={onMoreClick}
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
  fullText,
}: {
  item: AnnouncementItem
  sx?: SxProps
  fullText?: boolean
}) => {
  const theme = useTheme()
  const highlightColor = !item.highlight_color
    ? undefined
    : theme.palette.mode == 'dark'
      ? (item.dark_highlight_color ?? item.highlight_color)
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
        <Typography
          className={fullText ? undefined : 'line-clamp-1'}
          variant="threadItemSummary"
        >
          {item.summary}
          <Link to={item.href} underline="none">
            【点我查看】
          </Link>
        </Typography>
      </Box>
    </Stack>
  )
}

const MoreDialog = ({
  onClose,
  announcement,
}: {
  onClose: () => void
  announcement?: AnnouncementItem[]
}) => {
  const theme = useTheme()
  const narrowView = useMediaQuery('(max-width: 640px)')

  return (
    <GeneralDialog
      titleText="本站公告"
      open
      onClose={onClose}
      actions={[
        {
          type: 'ok',
          onClick: async () => {
            onClose()
          },
        },
      ]}
      maxWidth="md"
      fullWidth
      PaperProps={
        narrowView
          ? { sx: { m: 0, width: '100%', maxHeight: '100%' } }
          : undefined
      }
    >
      <List disablePadding>
        {announcement?.map((item, index) => (
          <ListItem key={index} sx={{ p: 0, my: 1 }} onClick={onClose}>
            <AnnouncementBody
              item={item}
              sx={{
                width: '100%',
                ...(theme.palette.mode == 'light'
                  ? {
                      backgroundColor:
                        theme.palette.background.paperHighlighted,
                    }
                  : undefined),
              }}
              fullText
            />
          </ListItem>
        ))}
      </List>
    </GeneralDialog>
  )
}

const Announcement = ({ inSwiper }: { inSwiper?: boolean }) => {
  const theme = useTheme()
  const { state, dispatch } = useAppState()
  const [moreOpen, setMoreOpen] = useState(false)
  const matches = useMatches()
  const swiperRef = useRef<SwiperRef>(null)
  const narrowView = useMediaQuery('(max-width: 640px)')
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
        onMoreClick={() => setMoreOpen(true)}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          slidesPerView={1}
          loop={state.announcement.length > 1}
          nested={inSwiper}
          css={{ flexGrow: 1, flexShrink: 1 }}
          ref={swiperRef}
        >
          {state.announcement.map((item, index) => (
            <SwiperSlide key={index}>
              <AnnouncementBody item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        {!narrowView && state.announcement.length > 1 && (
          <Stack
            sx={{ backgroundColor: theme.palette.background.paperHighlighted }}
          >
            <Stack direction="row">
              <IconButton
                color="info"
                onClick={() => swiperRef.current?.swiper?.slidePrev()}
              >
                <ArrowBackIosNew />
              </IconButton>
              <IconButton
                color="info"
                onClick={() => swiperRef.current?.swiper?.slideNext()}
              >
                <ArrowForwardIos />
              </IconButton>
            </Stack>
            <Button onClick={() => setMoreOpen(true)}>
              <More />
            </Button>
          </Stack>
        )}
        {moreOpen && (
          <MoreDialog
            announcement={state.announcement}
            onClose={() => setMoreOpen(false)}
          />
        )}
      </AnnouncementBox>
    )
  }
}

export default Announcement
