import { useState } from 'react'

// import {  } from 'react-router-dom'
import {
  ExpandLess,
  ExpandMore,
  ModeComment,
  RemoveRedEye,
  ThumbUpAlt,
} from '@mui/icons-material'
import {
  Box,
  Collapse,
  Divider,
  Grid,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { Forum } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import Link from '@/components/Link'
import UserCard from '@/components/UserCard'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'

type ForumData = {
  data: Forum
}

const ForumCover = ({ data }: ForumData) => {
  const coverImg = new URL(
    `../../assets/forumCover/${data.name}.jpg`,
    import.meta.url
  )

  const defaultImg = new URL(
    `../../assets/forumCover/default.jpg`,
    import.meta.url
  )

  let imgUrl
  if (coverImg.pathname === '/undefined') {
    imgUrl = defaultImg.href
  } else {
    imgUrl = coverImg.href
  }

  return (
    <Box className="relative rounded text-white overflow-hidden">
      <Box
        className="absolute top-0 left-0 h-full w-full"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></Box>
      <Box className="absolute top-0 left-0 h-full w-full bg-black opacity-40"></Box>
      <Box className="relative z-10 p-4">
        <Link
          className="font-bold"
          color="inherit"
          underline="hover"
          to={`forum/${data.fid}`}
        >
          {data.name}
        </Link>

        <Stack direction="row">
          <UserCard uid={12}>
            <>管理员</>
          </UserCard>
        </Stack>

        <Stack direction="row" className="mt-4">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <RemoveRedEye />
            <Typography className="pl-2 text-right">{data.views}</Typography>
          </Stack>
          <Stack
            direction="row"
            className="pl-6"
            alignItems="center"
            justifyContent="space-between"
          >
            <ModeComment />
            <Typography className="pl-2">{data.replies}</Typography>
          </Stack>
          <Stack
            direction="row"
            className="pl-6"
            alignItems="center"
            justifyContent="space-between"
          >
            <ThumbUpAlt />
            <Typography className="pl-2">{data.favtimes}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" className="mt-4">
          <Box className="mr-4">
            <Avatar
              alt={data.author}
              uid={data.authorid}
              sx={{ width: 40, height: 40 }}
              variant="rounded"
            />
          </Box>
          <Box className="flex-1">
            <Stack direction="row">
              <Link
                color="inherit"
                underline="hover"
                to={`/thread/${data.tid}`}
              >
                <Box className="line-clamp-1">
                  <Chip text={data.name} />
                  {data.subject}
                </Box>
              </Link>
            </Stack>
            <Stack direction="row">
              <Typography>{chineseTime(data.dateline * 1000)}</Typography>
              <Typography className="mx-1">·</Typography>
              <UserCard uid={data.authorid}>
                <Link color="inherit">{data.author}</Link>
              </UserCard>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export const ForumGroup = ({ data }: ForumData) => {
  const [open, setOpen] = useState(true)
  const { state } = useAppState()
  const theme = useTheme()

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemText>{data.name}</ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider
        className="border-b-4 rounded-lg"
        style={{ borderBottomColor: theme.palette.primary.main }}
      />
      <Collapse in={open} timeout="auto" unmountOnExit className="p-4">
        <Grid container spacing={2}>
          {data?.forums?.map((item, index) => (
            <Grid item md={6} xl={4} key={index}>
              <ForumCover data={item} />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </>
  )
}
