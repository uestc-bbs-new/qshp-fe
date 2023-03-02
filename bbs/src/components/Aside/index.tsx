import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { Box, List, Typography } from '@mui/material'

import { getHotThread } from '@/apis/common'
import Card from '@/components/Card'
import Post from '@/components/Post'

import Static from './Static'

const Aside = () => {
  const location = useLocation()

  const { data: hot, isLoading } = useQuery(['hotThread'], () =>
    getHotThread({ forum_id: 0 })
  )

  return (
    <Box className="ml-6 w-60">
      <Card className="mb-4" tiny>
        <List>
          {isLoading ? (
            <Typography>none</Typography>
          ) : (
            hot?.threads?.map((item) => (
              <Post small data={item} key={item.tid} className="mb-4" />
            ))
          )}
        </List>
      </Card>
      {location.pathname === '/' ? <Static /> : <></>}
    </Box>
  )
}

export default Aside
