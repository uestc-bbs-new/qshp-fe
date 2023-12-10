import { useState } from 'react'

// import {  } from 'react-router-dom'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
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
import Link from '@/components/Link'
import Separated from '@/components/Separated'
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
    <Box
      className="relative rounded text-white overflow-hidden"
      style={{ width: '100%' }}
    >
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link
            className="font-bold"
            color="inherit"
            underline="hover"
            to={`forum/${data.fid}`}
          >
            <Typography variant="h6" fontWeight="bold">
              {data.name}
            </Typography>
          </Link>
          <Typography>{data.todayposts || ''}</Typography>
        </Stack>

        {/* <Stack direction="row">
          <UserCard uid={12}>
            <>管理员</>
          </UserCard>
        </Stack> */}

        <Stack direction="row" className="mt-4" minHeight={40}>
          {!!data.latest_thread?.thread_id && (
            <Box
              className="mr-4"
              visibility={data.latest_thread?.thread_id ? 'visible' : 'hidden'}
            >
              <Avatar
                alt={data.latest_thread?.lastpost_author}
                uid={data.latest_thread?.lastpost_authorid}
                sx={{ width: 40, height: 40 }}
                variant="rounded"
              />
            </Box>
          )}
          {data.latest_thread && (
            <Box className="flex-1">
              <Stack direction="row">
                <Link
                  color="inherit"
                  underline="hover"
                  to={
                    data.latest_thread?.thread_id
                      ? `/thread/${data.latest_thread?.thread_id}`
                      : undefined
                  }
                >
                  <Box className="line-clamp-1">
                    {data.latest_thread?.subject || '\u00a0'}
                  </Box>
                </Link>
              </Stack>
              <Stack direction="row">
                <Typography>
                  {chineseTime(data.latest_thread?.lastpost_time * 1000)}
                </Typography>
                {!!data.latest_thread?.thread_id && (
                  <>
                    <Typography className="mx-1">·</Typography>
                    <Link color="inherit">
                      {data.latest_thread?.lastpost_author}
                    </Link>
                  </>
                )}
              </Stack>
            </Box>
          )}
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

  const moderators = data?.moderators || []
  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemText>{data.name}</ListItemText>
        <Stack direction="row" alignItems="baseline">
          {moderators.length > 0 && <Typography>分区版主：</Typography>}
          <Separated
            separator={<Typography marginRight="0.35em">,</Typography>}
          >
            {moderators.map((moderator, index) => (
              <Link
                key={index}
                color="inherit"
                variant="subtitle2"
                to={`/user/name/${moderator}`}
              >
                {moderator}
              </Link>
            ))}
          </Separated>
        </Stack>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider
        className="border-b-4 rounded-lg"
        style={{ borderBottomColor: theme.palette.primary.main }}
      />
      <Collapse in={open} timeout="auto" unmountOnExit className="p-4">
        <Grid container spacing={2}>
          {data?.children
            ?.filter((item) => item.name)
            .map((item, index) => (
              <Grid item md={6} xl={4} key={index} style={{ width: '100%' }}>
                <ForumCover data={item} />
              </Grid>
            ))}
        </Grid>
      </Collapse>
    </>
  )
}
