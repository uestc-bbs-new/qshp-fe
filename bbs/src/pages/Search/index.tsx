import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { Box, List, Pagination, Typography } from '@mui/material'

import { searchThreads } from '@/apis/common'
import { Thread } from '@/common/interfaces/response'
import Post from '@/components/Post'

const EmptySearch = () => {
  return (
    <>
      <Typography>清水河畔</Typography>
      <Box className="shadow">
        <Typography>没有发现任何搜索结果。</Typography>
      </Box>
    </>
  )
}

type resultProps = {
  name: string
  data: Thread[]
  total: number
  pageSize: number
  setPage: React.Dispatch<React.SetStateAction<string | number>>
}
const SearchResult = ({
  name,
  data,
  total,
  pageSize,
  setPage,
}: resultProps) => {
  return (
    <>
      <Typography>搜索结果: {name}</Typography>
      <Box>
        <List>
          {data.map((item) => (
            <Post data={item} key={item.tid} />
          ))}
        </List>
      </Box>
      <Pagination
        variant="outlined"
        shape="rounded"
        count={Math.ceil(total / pageSize)}
        onChange={(e, value) => setPage(value)}
      ></Pagination>
    </>
  )
}

const Search = () => {
  const params = new URLSearchParams(window.location.search)
  const name = params.get('name')
  const [page, setPage] = useState(params.get('page') || 1)
  const pageSize = 10

  const { data, refetch } = useQuery(
    ['search'],
    () => searchThreads({ keyWord: name, pageNum: page, pageSize: 10 }),
    {
      // close auto fetch when preload
      enabled: false,
    }
  )

  useEffect(() => {
    if (name && name.length > 0) {
      refetch()
    }
  }, [])

  if (name && data && data.resultNum > 0) {
    return (
      <SearchResult
        name={name}
        pageSize={pageSize}
        data={data.threads}
        total={data.resultNum}
        setPage={setPage}
      />
    )
  } else if (name?.length === 0 || (data && data.resultNum === 0)) {
    return <EmptySearch />
  } else {
    return <Typography>Loading...</Typography>
  }
}

export default Search
