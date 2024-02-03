import { Box, Paper, Stack, Typography } from '@mui/material'

import { ThreadBasics, TopListKey } from '@/common/interfaces/response'
import { topListTitleMap } from '@/utils/constants'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'

const kCount = 8

const HeaderCard = ({ id, list }: { id: TopListKey; list: ThreadBasics[] }) => (
  <Box className="relative overflow-hidden mb-5 p-1" style={{ width: '100%' }}>
    <Paper elevation={3}>
      <Box
        className="pt-3 px-8 pb-2"
        sx={(theme) => {
          const light = theme.palette.mode == 'light'
          return {
            background: `linear-gradient(90deg, ${
              light ? '#E4EEFE' : 'rgba(32, 99, 212, 0.6)'
            } 40%, ${light ? '#FFFFFF' : 'rgba(0, 0, 0, 0)'} 100%)`,
          }
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }} variant="h6">
          {topListTitleMap[id]}
        </Typography>
      </Box>
      <Stack direction="column">
        {list.slice(0, kCount).map((thread, index) => (
          <Stack key={index} direction="row" sx={{ my: 0.5 }}>
            <Box className="p-1">
              <Box sx={{ mx: 1 }}>
                <Avatar
                  alt={thread.author}
                  uid={thread.author_id}
                  sx={{ width: 35, height: 35 }}
                  variant="rounded"
                />
              </Box>
            </Box>
            <Box className="flex-1" minWidth="1em" mr={2}>
              <Stack direction="column">
                <Link
                  to={pages.thread(thread.thread_id)}
                  state={{ fromTopList: id }}
                  color="inherit"
                  underline="hover"
                >
                  <Box>
                    <Typography
                      sx={{
                        mt: 0.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {thread.subject}
                    </Typography>
                  </Box>
                </Link>
                <Typography
                  sx={{
                    fontSize: 12,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '210px',
                  }}
                  color="grey"
                >
                  {thread.summary}
                </Typography>
              </Stack>
            </Box>
            <Link
              fontSize={12}
              fontWeight={600}
              className="mr-5 mt-3"
              underline="hover"
              to={thread.author_id ? `/user/${thread.author_id}` : undefined}
              sx={thread.author_id == 0 ? { cursor: 'pointer' } : null}
            >
              {thread.author}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Paper>
  </Box>
)

export default HeaderCard
