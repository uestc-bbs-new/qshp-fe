import React, { useEffect, useState } from 'react'

import { Box, List, Pagination, Stack, Typography } from '@mui/material'

import Post from '@/components/Post'
import { searchThreads } from '@/apis/common'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
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
  const { data, refetch } = useQuery(
    ['search'],
    () => searchThreads({ keyWord: name, pageNum: page, pageSize: 10 }),
    {
      // close auto fetch when preload
      enabled: false,
    }
  )

  let location = useLocation();
  useEffect(() => {
    setName(location.search.split('=')[2])
    if (location.search.split('=')[1].split('&')[0] == 'post')
      refetch()
    // console.log(page)
  }, [location, page]);


  if (name && data && data.resultNum > 0) {
    return (
      <Box className="flex-1">
        <Typography>搜索结果: {name}</Typography>
        <Box>
          <List>
            {data.threads.map((item) => (
              <Post data={item} key={item.thread_id} />
            ))}
          </List>
        </Box>
        <Stack alignItems="center">
          <Pagination
            className='mt-4'
            variant="outlined"
            shape="rounded"
            count={Math.ceil(data.resultNum / pageSize)}
            onChange={(e, value) => setPage(value)}
          ></Pagination>
        </Stack>

      </Box>
    )
  } else if (name?.length === 0 || (data && data.resultNum === 0)) {
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