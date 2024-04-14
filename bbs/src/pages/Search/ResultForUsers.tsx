import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Box, Grid, Pagination, Stack, Typography } from '@mui/material'

import { searchUsers } from '@/apis/search'
import PostUsers from '@/components/PostUsers'

import EmptySearch from './EmptySearch'

type resultProps = {
  target: string | null
  page: number | string
  pageSize: number
  searchType: string
  setName: React.Dispatch<React.SetStateAction<string | null>>
  setPage: React.Dispatch<React.SetStateAction<string | number>>
}
const RersultForUsers = ({
  target,
  page,
  pageSize,
  searchType,
  setName,
  setPage,
}: resultProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const location = useLocation()
  const [currentName, setCurrentName] = useState(target)
  const { data, refetch } = useQuery({
    queryKey: ['search'],
    queryFn: () => searchUsers({ query: currentName, page: currentPage }),
    // searchType == 'username'
    //   ? searchUsers({ username: currentName, page: currentPage })
    //   : searchUsers_uid({ uid: currentName, page: currentPage })
    // close auto fetch when preload
    enabled: true,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (location.search.split('=')[1].split('&')[0] == 'user') {
      refetch()
    }
  }, [currentPage, currentName])

  useEffect(() => {
    setCurrentName(decodeURI(location.search.split('=')[2]))
    setCurrentPage(1)
  }, [location])

  if (currentName && data && data.total > 0) {
    return (
      <Box className="flex-1">
        <Typography>搜索结果: {target}</Typography>
        <Box>
          <Grid container spacing={0.5}>
            {data?.rows.map((item, index) => (
              <Grid item md={6} xl={6} key={index}>
                <PostUsers data={item} key={item.uid} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Stack alignItems="center">
          <Pagination
            className="mt-10"
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
  } else if (currentName?.length === 0 || (data && data.total === 0)) {
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
