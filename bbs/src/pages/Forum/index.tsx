import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Skeleton,
  useTheme,
} from '@mui/material'

import { getThreadList } from '@/apis/common'
import Card from '@/components/Card'
import Post from '@/components/Post'

import Head from './ForumHead'

type TopProps = {
  children: React.ReactElement
}
const Top = ({ children }: TopProps) => {
  const [isTopOpen, setTopOpen] = useState(true)
  const theme = useTheme()
  const handleClick = () => {
    setTopOpen(!isTopOpen)
  }
  return (
    <>
      <ListItemButton
        // disableGutters
        onClick={handleClick}
      >
        <ListItemText>置顶主题</ListItemText>
        {isTopOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider
        className="border-b-4 rounded-lg"
        style={{ borderBottomColor: theme.palette.primary.main }}
      />
      <Collapse in={isTopOpen} timeout="auto" unmountOnExit>
        {/* <Skeleton></Skeleton> */}
        {isTopOpen && children}
      </Collapse>
    </>
  )
}

type NormalProps = {
  sortBy: string
  handleSortChange: any
  children: React.ReactElement
}
const Normal = ({ sortBy, handleSortChange, children }: NormalProps) => {
  const theme = useTheme()
  return (
    <>
      <ListItem>
        <ListItemText>普通主题</ListItemText>
        <Select
          variant="standard"
          disableUnderline
          value={sortBy}
          onChange={handleSortChange}
        >
          <MenuItem value="1">最新回复</MenuItem>
          <MenuItem value="2">最新发表</MenuItem>
          <MenuItem value="3">最热主题</MenuItem>
        </Select>
      </ListItem>
      <Divider
        className="border-b-4 rounded-lg"
        style={{ borderBottomColor: theme.palette.primary.main }}
      />
      {children}
    </>
  )
}

function Forum() {
  const [sortBy, setSort] = useState('1') // thread sort rule
  //const [postList, setPostList] = useState([]) // 新建一个postList状态值，用来同步渲染post组件
  const routeParam = useParams()
  const params = new URLSearchParams(window.location.search)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState({
    page: 1,
    type: 1,
    forum_id: routeParam.id,
    forum_details: 1,
  })

  const pageSize = 20
  const {
    data: threadList,
    isLoading,
    refetch,
    isFetching,
  } = useQuery(['getThread', query], () => getThreadList(query), {
    onSuccess: (data: any) => {
      if (data && data.total) {
        setTotal(Math.ceil(data.total / pageSize))
      }
    },
  })

  const location = useLocation()

  useEffect(() => {
    setQuery({
      ...query,
      forum_id: routeParam.id,
    })
    refetch()
  }, [location, query.type, query.page])

  const handleSortChange = (event: SelectChangeEvent) => {
    window.scrollTo(0, 0)
    setSort(event.target.value)
    setPage(1)
    const value = event.target.value
    setQuery({ ...query, page: 1, type: parseInt(value, 10) })
  }

  const handlePageChange = (event: any, value: number) => {
    window.scrollTo(0, 0)
    setPage(value)
    setQuery({ ...query, page: Number(value) })
  }

  return (
    <Box className="flex-1" style={{ marginTop: '20px' }}>
      {isFetching ? (
        <Card>
          <List>
            <ListItem>
              <Skeleton className="w-full" height={81}></Skeleton>
            </ListItem>
          </List>
        </Card>
      ) : threadList?.forum ? (
        <Head data={threadList?.forum}></Head>
      ) : null}
      <Pagination
        size="small"
        page={page}
        onChange={handlePageChange}
        count={total}
        variant="outlined"
        shape="rounded"
        style={{ margin: '20px' }}
        sx={{ display: 'flex', justifyContent: 'center' }}
      />
      <Card>
        <>
          {threadList?.rows?.some((item: any) => item.display_order > 0) && (
            <Top>
              {isFetching ? (
                <List>
                  <ListItem>
                    <Skeleton className="w-full" height={81}></Skeleton>
                  </ListItem>
                </List>
              ) : (
                <List>
                  {threadList?.rows
                    ?.filter((item: any) => item.display_order > 0)
                    .map((item: any) => (
                      <Post data={item} key={item.thread_id} />
                    ))}
                </List>
              )}
            </Top>
          )}
          <Normal sortBy={sortBy} handleSortChange={handleSortChange}>
            {isFetching || !threadList?.rows?.length ? (
              <List>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={100}
                  ></Skeleton>
                </ListItem>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={100}
                  ></Skeleton>
                </ListItem>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={100}
                  ></Skeleton>
                </ListItem>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={100}
                  ></Skeleton>
                </ListItem>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={100}
                  ></Skeleton>
                </ListItem>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={100}
                  ></Skeleton>
                </ListItem>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={100}
                  ></Skeleton>
                </ListItem>
                <ListItem>
                  <Skeleton
                    className="w-full"
                    width={961}
                    height={81}
                  ></Skeleton>
                </ListItem>
              </List>
            ) : (
              <List>
                {threadList?.rows
                  ?.filter((item: any) => item.display_order === 0)
                  .map((item: any) => (
                    <Post data={item} key={item.thread_id} />
                  ))}
              </List>
            )}
          </Normal>
        </>
      </Card>
      <Pagination
        size="small"
        page={page}
        onChange={handlePageChange}
        count={total}
        variant="outlined"
        shape="rounded"
        style={{ marginTop: '20px' }}
        sx={{ display: 'flex', justifyContent: 'center' }}
      />
      {/* <Edit></Edit> */}
    </Box>
  )
}
export default Forum
