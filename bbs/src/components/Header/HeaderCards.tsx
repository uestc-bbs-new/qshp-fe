import { Box, Grid, Paper, Stack, Typography } from '@mui/material'

import { useAppState } from '@/states'

import Avatar from '../Avatar'
import Link from '../Link'

const renderTextById = (id: number) => {
  switch (id) {
    case 1:
      return '最新回复'
    case 2:
      return '最新发表'
    case 3:
      return '精华展示'
  }
}
const headerCard = (id: number) => {
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
            {renderTextById(id)}
          </Typography>
        </Box>
        <Stack direction="column">
          {/* 这里map data */}
          {Array.from(new Array(5)).map((index) => (
            <Stack key={index} direction="row" sx={{ my: 0.5 }}>
              <Box className="p-1">
                <Box sx={{ mx: 1 }}>
                  <Avatar
                    alt="0"
                    uid={0}
                    sx={{ width: 35, height: 35 }}
                    variant="rounded"
                  />
                </Box>
              </Box>
              <Box className="flex-1">
                <Stack direction="column">
                  <Link
                    to={`/thread/0`}
                    color="inherit"
                    underline="hover"
                    className={'line-clamp-3'}
                    onClick={handleClick}
                  >
                    <Box>
                      <Typography sx={{ mt: 0.3 }}>标题balabala</Typography>
                    </Box>
                  </Link>
                  <Link sx={{ fontSize: 12 }} underline="none" color="grey">
                    作者
                  </Link>
                </Stack>
              </Box>
              <Typography
                fontSize={12}
                fontWeight={600}
                className="mr-5 mt-3"
                color="#3A71F2"
              >
                2023-11-28
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}
const HeaderCards = () => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {headerCard(1)}
        </Grid>
        <Grid item xs={12} md={4}>
          {headerCard(2)}
        </Grid>
        <Grid item xs={12} md={4}>
          {headerCard(3)}
        </Grid>
      </Grid>
    </>
  )
}
export default HeaderCards
