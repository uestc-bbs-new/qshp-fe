import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { List, Skeleton, Tab, Tabs } from '@mui/material'

import { TopList, TopListKey } from '@/common/interfaces/response'
import Card from '@/components/Card'
import { ThreadItemLite } from '@/components/ThreadItem'
import {
  topListSideKeys,
  topListTitleMap,
  topListTopKeys,
} from '@/utils/constants'

const SideTabs = ({
  loading,
  topList,
  homepage,
}: {
  loading?: boolean
  topList?: TopList
  homepage?: boolean
}) => {
  const kListSize = 10
  const kTopListAsideLastTab = 'toplist_aside_last_tab'
  const { state: routeState } = useLocation()
  let initialTab: TopListKey = homepage ? 'hotlist' : 'newreply'
  let tabs: TopListKey[] = topListSideKeys
  if (!homepage) {
    tabs = topListTopKeys.concat(tabs)
  }
  if (homepage) {
    try {
      const value = localStorage.getItem(kTopListAsideLastTab)
      if (value && topListSideKeys.includes(value as TopListKey)) {
        initialTab = value as TopListKey
      }
    } catch (_) {
      /* Do not crash in case of exception thrown in localStorage */
    }
  } else {
    if (routeState?.fromTopList) {
      initialTab = routeState.fromTopList
    }
  }
  const [value, setValue] = useState<TopListKey>(initialTab)

  const handleChange = (_: React.SyntheticEvent, value: TopListKey) => {
    setValue(value)
    localStorage.setItem(kTopListAsideLastTab, value)
  }

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        variant={homepage ? undefined : 'scrollable'}
        scrollButtons={homepage ? undefined : 'auto'}
        sx={{
          pt: 1,
          mb: 1,
          borderBottom: 1,
          borderColor: 'divider',
          'MuiTabScrollButton-root': { width: 24 },
        }}
      >
        {tabs.map((key) => (
          <Tab
            key={key}
            label={topListTitleMap[key]}
            value={key}
            sx={{ minHeight: 32, ...(!homepage && { minWidth: 0 }) }}
          />
        ))}
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
    </>
  )
}

export default SideTabs
