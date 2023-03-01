import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Whatshot } from '@mui/icons-material'
import {
  Box,
  Divider,
  List,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'

// import data from './test'
// import { getThreadList } from '@/apis/common'
import Post from '@/components/Post'
import { useAppState } from '@/states'

type SvgIconComponent = typeof SvgIcon
type BoxHeaderProps = {
  text: string
  Icon: SvgIconComponent
}
const BoxHeader = ({ text, Icon }: BoxHeaderProps) => {
  return (
    <Box>
      <Stack direction="row" className="p-3">
        <Icon sx={{ mr: 2 }} />
        <Typography>{text}</Typography>
      </Stack>
      <Divider />
    </Box>
  )
}

function Forum() {
  const { state, dispatch } = useAppState()
  const [tabIndex, setTabIndex] = useState(0)
  const routeParam = useParams()
  // const {data: threadList, isLoading} = useQuery(['getThread', () => getThreadList({forum_id: routeParam.fid})])

  const handleTabClick = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <Box className="flex">
      <Box className="flex-1">
        <Box className="rounded-lg bg-white drop-shadow-md">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabClick}
              aria-label="basic tabs"
            >
              <Tab label="最新发表" />
              <Tab label="最新回复" />
              <Tab label="精华展示" />
            </Tabs>
          </Box>
          <List>
            {/* {data.data.map((item) => (
              <Post data={item} key={item.id} />
            ))} */}
          </List>
        </Box>
      </Box>
      <Box className="ml-6 w-60">
        <Box className="mb-6 rounded-lg bg-white drop-shadow-md">
          <BoxHeader text="今日热门" Icon={Whatshot} />
          <List></List>
        </Box>
      </Box>
    </Box>
  )
}
export default Forum
