import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { ArrowDropDown } from '@mui/icons-material'
import {
  IconButton,
  List,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'

import { TopList, TopListKey } from '@/common/interfaces/response'
import Card from '@/components/Card'
import { ThreadItemLite } from '@/components/ThreadItem'
import { globalCache } from '@/states'
import {
  topListSideKeys,
  topListTitleMap,
  topListTopKeys,
} from '@/utils/constants'
import { persistedStates } from '@/utils/storage'

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
  const { state: routeState } = useLocation()
  let initialTab: TopListKey = homepage ? 'hotlist' : 'newreply'
  let tabs: TopListKey[] = topListSideKeys
  if (!homepage) {
    tabs = topListTopKeys.concat(tabs)
  }
  if (homepage) {
    const value = persistedStates.topListAsideLastTab
    if (value && topListSideKeys.includes(value as TopListKey)) {
      initialTab = value as TopListKey
    }
  } else {
    if (routeState?.fromTopList) {
      initialTab = routeState.fromTopList
    } else if (globalCache.topListLastKey) {
      initialTab = globalCache.topListLastKey
    }
  }
  const [value, setValue] = useState<TopListKey>(initialTab)
  useEffect(() => {
    if (homepage) {
      persistedStates.topListAsideLastTab = value
    } else {
      globalCache.topListLastKey = value
    }
  }, [value])

  const handleChange = (_: React.SyntheticEvent, value: TopListKey) => {
    setValue(value)
  }

  const tabsRef = useRef(null)
  const expandRef = useRef(null)
  const [menuOpenSide, setMenuOpenSide] = useState<'left' | 'right' | ''>('')
  const closeMenu = () => setMenuOpenSide('')
  return (
    <>
      {loading ? (
        <Skeleton height={56} />
      ) : (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tabs
            ref={tabsRef}
            value={value}
            onChange={handleChange}
            variant={homepage ? undefined : 'scrollable'}
            scrollButtons={homepage ? undefined : 'auto'}
            sx={{
              pt: 1,
              mb: 1,
              borderBottom: 1,
              borderColor: 'divider',
              ...(!homepage && {
                '.MuiTabs-flexContainer': { justifyContent: 'space-between' },
              }),
            }}
          >
            {tabs
              .filter((key) => (homepage ? true : key == value))
              .map((key) => (
                <Tab
                  key={key}
                  label={topListTitleMap[key]}
                  value={key}
                  sx={{ minHeight: 32, ...(!homepage && { minWidth: 0 }) }}
                  onClick={homepage ? undefined : () => setMenuOpenSide('left')}
                />
              ))}
          </Tabs>
          {!homepage && (
            <>
              <IconButton
                key="_dropdown"
                ref={expandRef}
                onClick={() => setMenuOpenSide('right')}
              >
                <ArrowDropDown />
              </IconButton>
              <Menu
                key="_menu"
                anchorEl={tabsRef.current}
                anchorOrigin={{
                  horizontal: menuOpenSide || 'left',
                  vertical: 'bottom',
                }}
                transformOrigin={{
                  horizontal: menuOpenSide || 'left',
                  vertical: 'top',
                }}
                open={!!menuOpenSide}
                onClose={closeMenu}
              >
                {tabs.map((key) => (
                  <MenuItem
                    key={key}
                    selected={key == value}
                    onClick={() => {
                      setValue(key)
                      closeMenu()
                    }}
                  >
                    {topListTitleMap[key]}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Stack>
      )}
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
                <ThreadItemLite item={item} key={index} fromTopList={value} />
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
