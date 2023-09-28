import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { Box, List, Typography } from '@mui/material'

import { getBBSInfo } from '@/apis/common'
import Card from '@/components/Card'
import Post from '@/components/Post'

import Static from './Static'

const Aside = () => {
  const location = useLocation()

  const { data: hot, isLoading } = useQuery(['hotThread'], () =>
    getBBSInfo()
  )

  return (
    <Box className="ml-2 w-60">
      <Card className="mb-3" tiny>
        <List>
          {isLoading ? (
            <Typography>none</Typography>
          ) : (
            hot?.threads?.map((item) => (
              <Post small data={item} key={item.thread_id} className="mb-4" />
            ))
          )}
        </List>
      </Card>
      {location.pathname === '/' ? <Static /> : <></>}
    </Box>
  )
}

export default Aside
