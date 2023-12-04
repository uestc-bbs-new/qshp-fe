import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { Box, List, Pagination, Paper, Stack, Typography } from '@mui/material'

import { searchThreads } from '@/apis/common'
import Post from '@/components/Post'

import EmptySearch from './EmptySearch'

type resultProps = {
  name: string | null
  page: number | string
  pageSize: number
  setName: React.Dispatch<React.SetStateAction<string | null>>
  setPage: React.Dispatch<React.SetStateAction<string | number>>
}
const RersultForPost = ({
  name,
  page,
  pageSize,
  setPage,
  setName,
}: resultProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentName, setCurrentName] = useState(name)
  const { data, refetch } = useQuery(
    ['search'],
    () =>
      searchThreads({
        pageSize: 10,
        pageNum: currentPage,
        keyWord: currentName,
      }),
    {
      // close auto fetch when preload
      enabled: true,
    }
  )

  const location = useLocation()
  useEffect(() => {
    setCurrentName(decodeURI(location.search.split('=')[2]))
    setCurrentPage(1)
  }, [location])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (location.search.split('=')[1].split('&')[0] == 'post') {
      refetch()
    }
  }, [currentPage, currentName])

  if (currentName && data && data.resultNum > 0) {
    return (
      <Box className="flex-1">
        <Typography variant="h5" sx={{ mb: 1 }}>
          搜索结果: {currentName}
        </Typography>
        <Typography fontSize={12} color="grey">
          搜索到{data.resultNum > 999 ? '999+' : data.resultNum}个相关结果
        </Typography>
        <Paper elevation={3} sx={{ borderRadius: '10px', mt: 1 }}>
          <List>
            {data.threads.map((item) => (
              <Post data={item} key={item.thread_id} />
            ))}
          </List>
        </Paper>
        <Stack alignItems="center">
          <Pagination
            className="mt-4"
            variant="outlined"
            shape="rounded"
            count={Math.ceil(data.resultNum / pageSize)}
            onChange={(e, value) => setCurrentPage(value)}
          ></Pagination>
        </Stack>
      </Box>
    )
  } else if (currentName?.length === 0 || (data && data.resultNum === 0)) {
    return <EmptySearch />
  } else {
    return (
      <Box className="flex-1">
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default RersultForPost
