import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material'

import Card from '@/components/Card'
// import data from './test'
// import { getThreadList } from '@/apis/common'
import Post from '@/components/Post'
import { useAppState } from '@/states'

function Forum() {
  const [tabIndex, setTabIndex] = useState(0)
  const [isTopOpen, setTopOpen] = useState(true)
  const routeParam = useParams()
  const theme = useTheme()

  const handleClick = () => {
    setTopOpen(!isTopOpen)
  }
  // const {data: threadList, isLoading} = useQuery(['getThread', () => getThreadList({forum_id: routeParam.fid})])

  const handleTabClick = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <Box className="flex-1">
      <Card>
        <Box>
          <ListItemButton
            // disableGutters
            onClick={handleClick}
          >
            <ListItemText>置顶主题</ListItemText>
            {isTopOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Box
            className="h-1 rounded-lg"
            style={{
              backgroundColor: theme.palette.primary.main,
            }}
          ></Box>
          <Collapse in={isTopOpen} timeout="auto" unmountOnExit>
            {'指定'}
          </Collapse>

          <ListItem>
            <ListItemText>普通主题</ListItemText>
          </ListItem>
          <Box
            className="h-1 rounded-lg"
            style={{
              backgroundColor: theme.palette.primary.main,
            }}
          ></Box>
          <Tabs
            value={tabIndex}
            onChange={handleTabClick}
            aria-label="basic tabs"
          >
            <Tab label="最新发表" />
            <Tab label="最新回复" />
            <Tab label="精华展示" />
          </Tabs>
          <List>
            {/* {data.data.map((item) => (
              <Post data={item} key={item.id} />
            ))} */}
          </List>
        </Box>
      </Card>
    </Box>
  )
}
export default Forum
