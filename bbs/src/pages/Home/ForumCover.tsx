import React, { useState } from 'react'

import {
  ListItemButton,
  ListItemText,
  Box,
  Collapse,
  Grid,
  Typography,
  Stack,
  Link,
  Divider,
} from '@mui/material'

import {
  ExpandLess,
  ExpandMore,
  RemoveRedEye,
  ModeComment,
  ThumbUpAlt,
} from '@mui/icons-material'

import Avatar from '@/components/Avatar'
import { chineseTime } from '@/utils/dayjs'
import Chip from '@/components/Chip'
import forumBg from '@/assets/login-bg1.jpg'
import UserCard from '@/components/UserCard'
import { Forum } from '@/common/interfaces/response'

type ForumData = {
  data: Forum
}

const ForumCover = ({ data }: ForumData) => {
  return (
    <Box
      className="rounded p-4 relative text-white"
      style={{
        backgroundImage: `url(${forumBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box className="absolute bg-black rounded opacity-40 top-0 left-0 h-full w-full"></Box>
      <Box className="relative z-10">
        <Link
          className="font-bold"
          color="inherit"
          underline="hover"
          href={`/forum/${data.fid}`}
        >
          {data.name}
        </Link>

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
              alt="Remy Sharp"
              src="https://mui.com/static/images/avatar/1.jpg"
              sx={{ width: 40, height: 40 }}
              variant="rounded"
            />
          </Box>
          <Box className="flex-1">
            <Stack direction="row">
              <Link
                color="inherit"
                underline="hover"
                href={`/thread/${data.tid}`}
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
                <Link href="#" color="inherit">
                  {data.author}
                </Link>
              </UserCard>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

const menuFontStyle = { fontSize: '1.2rem' }
export const ForumGroup = ({ data }: ForumData) => {
  const [open, setOpen] = useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton
        className="rounded-lg drop-shadow-md border-b-orange-50 border-b-2"
        onClick={handleClick}
      >
        <ListItemText
          primary={data.name}
          primaryTypographyProps={menuFontStyle}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Box className="h-1 bg-blue-400 rounded-lg"></Box>
      <Collapse in={open} timeout="auto" unmountOnExit className="p-4">
        <Grid container spacing={2}>
          {data?.forums?.map((item, index) => (
            <Grid item xs={4} key={index}>
              <ForumCover data={item} />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </>
  )
}
