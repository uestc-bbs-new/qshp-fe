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

import { Forum } from '@/common/interfaces/forum'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import Separated from '@/components/Separated'
import { chineseTime } from '@/utils/dayjs'
import { unescapeSubject } from '@/utils/htmlEscape'
import { pages } from '@/utils/routes'

import { getForumCover } from './forumCoverMap'

type ForumData = {
  data: Forum
}

const ForumCover = ({ data }: ForumData) => {
  return (
    <Box
      className="relative rounded text-white overflow-hidden"
      style={{ width: '100%' }}
    >
      <Box
        className="absolute top-0 left-0 h-full w-full"
        style={{
          backgroundImage: `url(${getForumCover(data.fid)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
        }}
      ></Box>
      <Box className="absolute top-0 left-0 h-full w-full bg-black opacity-40"></Box>
      <Box className="relative p-4">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link
            className="font-bold"
            color="inherit"
            underline="hover"
            to={pages.forum(data.fid)}
          >
            <Typography variant="h6" fontWeight="bold">
              {data.name}
            </Typography>
          </Link>
          <Typography>{data.todayposts || ''}</Typography>
        </Stack>

        <Stack direction="row" className="mt-4" minHeight={40}>
          {!!data.latest_thread?.thread_id && (
            <Box
              className="mr-4"
              visibility={data.latest_thread?.thread_id ? 'visible' : 'hidden'}
            >
              <Link
                to={
                  data.latest_thread?.lastpost_authorid
                    ? pages.user({
                        uid: data.latest_thread.lastpost_authorid,
                      })
                    : undefined
                }
                color="inherit"
              >
                <Avatar
                  alt={data.latest_thread?.lastpost_author}
                  uid={data.latest_thread?.lastpost_authorid}
                  size={40}
                />
              </Link>
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
                      ? pages.thread(data.latest_thread?.thread_id)
                      : undefined
                  }
                >
                  <Box className="line-clamp-1">
                    {unescapeSubject(
                      data.latest_thread?.subject || '\u00a0',
                      null,
                      true
                    )}
                  </Box>
                </Link>
              </Stack>
              <Stack direction="row">
                <Typography>
                  {chineseTime(data.latest_thread?.lastpost_time * 1000, {
                    short: true,
                  })}
                </Typography>
                {!!data.latest_thread?.thread_id && (
                  <>
                    <Typography className="mx-1">·</Typography>
                    <Link
                      to={
                        data.latest_thread?.lastpost_authorid
                          ? pages.user({
                              uid: data.latest_thread.lastpost_authorid,
                            })
                          : undefined
                      }
                      color="inherit"
                    >
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
                to={pages.user({ username: moderator })}
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
              <Grid item sm={6} lg={4} key={index} style={{ width: '100%' }}>
                <ForumCover data={item} />
              </Grid>
            ))}
        </Grid>
      </Collapse>
    </>
  )
}
