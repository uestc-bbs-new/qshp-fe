import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// import {  } from 'react-router-dom'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
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

const ForumCover = ({ data }: { data: Forum }) => {
  const navigate = useNavigate()
  const to = pages.forum(data.fid)
  return (
    <Box
      className="relative rounded text-white overflow-hidden"
      sx={{ width: '100%', cursor: 'pointer' }}
      onClick={() => navigate(to)}
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
            to={to}
            onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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
                      ? pages.threadLastpost(data.latest_thread?.thread_id)
                      : undefined
                  }
                  onClick={(e) => e.stopPropagation()}
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
              <Box className="line-clamp-1">
                <Typography component="span" sx={{ verticalAlign: 'middle' }}>
                  {chineseTime(data.latest_thread?.lastpost_time * 1000, {
                    short: true,
                  })}
                </Typography>
                {!!data.latest_thread?.thread_id && (
                  <>
                    <Typography
                      mx={0.5}
                      sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      ·
                    </Typography>
                    <Link
                      to={
                        data.latest_thread?.lastpost_authorid
                          ? pages.user({
                              uid: data.latest_thread.lastpost_authorid,
                            })
                          : undefined
                      }
                      color="inherit"
                      onClick={(e) => e.stopPropagation()}
                      sx={{ verticalAlign: 'middle' }}
                    >
                      {data.latest_thread?.lastpost_author}
                    </Link>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export const ForumGroup = ({
  data,
  toplistView,
}: {
  data: Forum
  toplistView?: boolean
}) => {
  const [open, setOpen] = useState(true)
  const theme = useTheme()
  const narrowView = useMediaQuery('(max-width: 640px')

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
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={narrowView ? { py: 2 } : { p: 1.75 }}
      >
        <Grid container columnSpacing={narrowView ? 0 : 1} rowSpacing={2}>
          {data?.children
            ?.filter((item) => item.name)
            .map((item, index) =>
              narrowView ? (
                <Grid item key={index} xs={6}>
                  <Button
                    component={Link}
                    to={pages.forum(item.fid)}
                    fullWidth
                    sx={{ justifyContent: 'flex-start', px: 0.75 }}
                  >
                    <Stack direction="row">
                      <Box
                        width={40}
                        height={40}
                        borderRadius="100%"
                        mr={1}
                        flexGrow={0}
                        flexShrink={0}
                        style={{
                          backgroundImage: `url(${getForumCover(item.fid)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <Stack>
                        <Typography fontSize={18}>{item.name}</Typography>
                        <Stack direction="row" alignItems="center">
                          {!!item.latest_thread?.lastpost_time && (
                            <Typography fontSize={12} variant="threadItemStat">
                              {chineseTime(
                                item.latest_thread.lastpost_time * 1000,
                                {
                                  short: true,
                                }
                              )}
                            </Typography>
                          )}
                          {!!item.todayposts && (
                            <Typography ml={1} variant="threadItemStat">
                              ({item.todayposts})
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Button>
                </Grid>
              ) : (
                <Grid
                  item
                  key={index}
                  style={{ width: '100%' }}
                  {...(toplistView
                    ? { sm: 6, lg: 4, xl: 3 }
                    : { sm: 6, lg: 4 })}
                >
                  <ForumCover data={item} />
                </Grid>
              )
            )}
        </Grid>
      </Collapse>
    </>
  )
}
