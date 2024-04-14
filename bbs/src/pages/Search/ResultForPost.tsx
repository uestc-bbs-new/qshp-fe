import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  List,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import { searchThreads } from '@/apis/search'
import EmptyList from '@/components/EmptyList'
import ThreadItem from '@/components/ThreadItem'
import { searchParamsAssign } from '@/utils/tools'

const ResultForPost = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initQuery = () => ({
    keyword: searchParams.get('q'),
    author: searchParams.get('author'),
    digest: !!searchParams.get('digest'),
    page: parseInt(searchParams.get('page') || '') || 1,
  })
  const [query, setQuery] = useState(initQuery())
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['search', 'threads', query],
    queryFn: () => searchThreads(query),
  })

  useEffect(() => {
    setQuery(initQuery())
  }, [searchParams])

  let queryPrompt = query.keyword || ''
  const queryPromptDetails: string[] = []
  if (query.author) {
    queryPromptDetails.push(`作者：${query.author}`)
  }
  if (query.digest) {
    queryPromptDetails.push(`只包含精华帖`)
  }
  if (!query.keyword) {
    queryPromptDetails.unshift('所有帖子')
  }
  if (queryPromptDetails.length > 0) {
    queryPrompt += `（${queryPromptDetails.join('，')}）`
  }

  return (
    <>
      {isLoading &&
        [...Array(15)].map((_, index) => <Skeleton key={index} height={85} />)}
      {!!data?.rows?.length && (
        <>
          <Typography variant="h5" sx={{ mb: 1 }}>
            搜索结果: {queryPrompt}
          </Typography>
          <Typography fontSize={12} color="grey">
            搜索到{data.total}条相关帖子
          </Typography>
          <Paper elevation={3} sx={{ borderRadius: '10px', mt: 1 }}>
            <List>
              {data.rows.map((item) => (
                <ThreadItem data={item} key={item.thread_id} />
              ))}
            </List>
          </Paper>
          <Stack direction="row" justifyContent="center" my={1.5}>
            <Pagination
              boundaryCount={3}
              siblingCount={1}
              page={data.page}
              count={Math.ceil(data.total / (data.page_size || 1))}
              onChange={(_, page) =>
                navigate(
                  `${location.pathname}?${searchParamsAssign(searchParams, {
                    page,
                  })}`
                )
              }
            />
          </Stack>
        </>
      )}
      {data && !data.total && <EmptyList text={'未找到相关帖子'} />}
    </>
  )
}

export default ResultForPost
