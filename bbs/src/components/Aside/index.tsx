import { useState } from 'react'

import { Box, List, Skeleton, Tab, Tabs } from '@mui/material'

import { TopList, TopListKey } from '@/common/interfaces/response'
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
  const kTopListAsideLastTab = 'toplist_aside_last_tab'
  let initialTab: TopListKey = 'hotlist'
  try {
    const value = localStorage.getItem(kTopListAsideLastTab)
    if (value == 'hotlist' || value == 'life') {
      initialTab = value
    }
  } catch (_) {
    /* Do not crash in case of exception thrown in localStorage */
  }
  const [value, setValue] = useState<TopListKey>(initialTab)

  const handleChange = (_, value: TopListKey) => {
    setValue(value)
    localStorage.setItem(kTopListAsideLastTab, value)
  }
  return (
    <Box className="ml-2 w-60">
      <Tabs
        value={value}
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
        <Tab label="生活信息" value="life" sx={{ minWidth: 2, p: 1, mt: -1 }} />
        <Tab
          label="今日热门"
          value="hotlist"
          sx={{ minWidth: 2, p: 2.5, mt: -1 }}
        />
      </Tabs>
      <Card tiny>
        {loading ? (
          <>
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} height={70} />
            ))}
          </>
        ) : topList ? (
          <List key={value}>
            {topList[value]
              ?.slice(0, kListSize)
              ?.map((item, index) => (
                <ThreadItemLite item={item} key={index} />
              ))}
          </List>
        ) : (
          <></>
        )}
      </Card>
    </Box>
  )
}

export default Aside
