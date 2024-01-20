import { useState } from 'react'

import { Box, List, Skeleton, Tab, Tabs } from '@mui/material'

import { TopList } from '@/common/interfaces/response'
import Card from '@/components/Card'
import { ThreadItemLite } from '@/components/ThreadItem'

const Aside = ({
  loading,
  topList,
}: {
  loading?: boolean
  topList?: TopList
}) => {
  const kListSize = 10
  const [id, setId] = useState(1)

  const handleChange = (event: React.SyntheticEvent, newId: number) => {
    setId(newId)
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
        <Tab label="生活信息" sx={{ minWidth: 2, p: 1, mt: -1 }} />
        <Tab label="今日热门" sx={{ minWidth: 2, p: 2.5, mt: -1 }} />
      </Tabs>
      <Card tiny>
        <List>
          {loading
            ? [...Array(10)].map((_, index) => (
                <Skeleton key={index} height={70} />
              ))
            : topList?.hotlist
                ?.slice(0, kListSize)
                ?.map((item, index) => (
                  <ThreadItemLite item={item} key={index} />
                ))}
        </List>
      </Card>
    </Box>
  )
}

export default Aside
