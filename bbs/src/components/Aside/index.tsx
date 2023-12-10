import { useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { Box, List, Tab, Tabs, Typography } from '@mui/material'

import { getBBSInfo } from '@/apis/common'
import Card from '@/components/Card'
import Post from '@/components/Post'
import { useActiveRoute } from '@/utils/routes'

import Static from './Static'

const Aside = () => {
  const location = useLocation()
  const [id, setId] = useState(2)
  const { data: hot, isLoading } = useQuery(['hotThread'], () => getBBSInfo())
  const activeRoute = useActiveRoute()

  const handleChange = (event: React.SyntheticEvent, newId: number) => {
    setId(newId)
  }

  if (activeRoute && activeRoute.id !== 'index' && activeRoute.id != 'forum') {
    return null
  }

  return (
    <Box className="ml-2 w-60">
      <Tabs
        value={id}
        onChange={handleChange}
        sx={{
          height: 2,
          pt: 1,
          px: 0.5,
          mb: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tab label="最新回复" sx={{ minWidth: 2, p: 1, mt: -1 }} />
        <Tab label="最新发表" sx={{ minWidth: 2, p: 1, mt: -1 }} />
        <Tab label="热门" sx={{ minWidth: 2, p: 2.5, mt: -1 }} />
      </Tabs>
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
