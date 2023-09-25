import React, { useEffect, useState } from 'react'

import { Box, Grid, List, Pagination, Stack, Typography } from '@mui/material'

import { searchUsers } from '@/apis/common'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import EmptySearch from './EmptySearch'
import PostUsers from '@/components/PostUsers'
import { useAppState } from '@/states'

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
  const [currentPage, setCurrentPage] = useState(1)
  const location = useLocation()
  const [currentName, setCurrentName] = useState(name)
  const { data, refetch } = useQuery(
    ['search'],
    () => searchUsers({ username: currentName, page: currentPage }),
    {
      // close auto fetch when preload
      enabled: true,
    }
  )

  useEffect(() => {
    if (location.search.split('=')[1].split('&')[0] == 'user') {
      refetch()
    }
  }, [currentPage, currentName]);

  useEffect(() => {
    console.log(currentName)
    setCurrentName(decodeURI(location.search.split('=')[2]))
    setCurrentPage(1)
  }, [location])
  // const startIndex = (currentPage - 1) * pageSize;
  // const endIndex = startIndex + pageSize;
  // const displayedData = data?.rows.slice(startIndex, endIndex);

  if (name && data && data.total > 0) {
    return (
      <Box className="flex-1">
        <Typography>搜索结果: {name}</Typography>
        <Box>
          <Grid container spacing={0.5}>
            {data?.rows.map((item, index) => (
              <Grid item md={6} xl={6} key={index}>
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
            onChange={(e, value) => {
              setCurrentPage(value)
            }}
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