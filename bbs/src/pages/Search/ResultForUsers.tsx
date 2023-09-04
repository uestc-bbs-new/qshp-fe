import React, { useEffect, useState } from 'react'

import { Box, Grid, List, Pagination, Stack, Typography } from '@mui/material'

import { searchUsers } from '@/apis/common'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import EmptySearch from './EmptySearch'
import PostUsers from '@/components/PostUsers'

type resultProps = {
  name: string | null
  page: number | string
  pageSize: number
  setName: React.Dispatch<React.SetStateAction<string | null>>
  setPage: React.Dispatch<React.SetStateAction<string | number>>
}
const RersultForUsers = ({
  name,
  page,
  pageSize,
  setName,
  setPage,
}: resultProps) => {
  const { data, refetch } = useQuery(
    ['search'],
    () => searchUsers({ keyWord: name, pageNum: page, pageSize: 10 }),
    {
      // close auto fetch when preload
      enabled: true,
    }
  )

  let location = useLocation();
  useEffect(() => {
    setName(location.search.split('=')[2])
    if (location.search.split('=')[1].split('&')[0] == 'user') {
      refetch()
    }
  }, [location, page]);

  if (name && data && data.total > 0) {
    return (
      <Box className="flex-1">
        <Typography>搜索结果: {name}</Typography>
        <Box>
          <Grid container spacing={1}>
            {data.rows.map((item, index) => (
              <Grid item md={6} xl={4} key={index}>
                <PostUsers data={item} key={item.user_id} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Stack alignItems="center">
          <Pagination
            className='mt-10'
            variant="outlined"
            shape="rounded"
            count={Math.ceil(data.total / pageSize)}
            onChange={(e, value) => setPage(value)}
          ></Pagination>
        </Stack>
      </Box>
    )
  } else if (name?.length === 0 || (data && data.total === 0)) {
    return <EmptySearch />
  } else {
    return (
      <Box className="flex-1">
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default RersultForUsers