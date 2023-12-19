import { Box, Grid, Paper, Stack, Typography } from '@mui/material'

import { ThreadBasics } from '@/common/interfaces/response'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'

const kCount = 5

const headerCard = (title: string, list: ThreadBasics[]) => {
  const { dispatch } = useAppState()
  const handleClick = () => {
    dispatch({ type: 'set post', payload: '0' })
  }

  return (
    <Box
      className="relative overflow-hidden mb-5 p-1"
      style={{ width: '100%' }}
    >
      <Paper elevation={3}>
        <Box
          className="pt-3 px-8 pb-2"
          sx={{
            background: 'linear-gradient(90deg, #E4EEFE 40%, #FFFFFF 100%)',
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            {title}
          </Typography>
        </Box>
        <Stack direction="column">
          {list.slice(0, kCount).map((thread, index) => (
            <Stack key={index} direction="row" sx={{ my: 0.5 }}>
              <Box className="p-1">
                <Box sx={{ mx: 1 }}>
                  <Avatar
                    alt="0"
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
                    color="inherit"
                    underline="hover"
                    onClick={handleClick}
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
                color="#3A71F2"
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
}
const HeaderCards = ({
  topLists,
}: {
  topLists: { [id: string]: ThreadBasics[] | undefined }
}) => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {headerCard('最新回复', topLists.newreply || [])}
        </Grid>
        <Grid item xs={12} md={4}>
          {headerCard('最新发表', topLists.newthread || [])}
        </Grid>
        <Grid item xs={12} md={4}>
          {headerCard('精华展示', topLists.digest || [])}
        </Grid>
      </Grid>
    </>
  )
}
export default HeaderCards
