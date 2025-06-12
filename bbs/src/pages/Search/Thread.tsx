import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  Button,
  List,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import { searchThreads } from '@/apis/search'
import EmptyList from '@/components/EmptyList'
// import ThreadItem from '@/components/ThreadItem'
import SearchResultItem from '@/components/SearchResult/'
import { searchParamsAssign } from '@/utils/tools'

const SORT_OPTIONS = [
  { label: '时间倒序（最新）', value: 'newest' },
  { label: '时间顺序（最早）', value: 'oldest' },
  { label: '支持数倒序（最多支持）', value: 'recommend_desc' },
  { label: '支持数顺序（最少支持）', value: 'recommend_asc' },
  { label: '相关性排序', value: 'relevance' },
]

const Thread = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance')

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleSortClose = (option?: string) => {
    setAnchorEl(null)
    if (option && option !== sort) {
      setSort(option)
      // 更新URL参数
      const newParams = new URLSearchParams(searchParams)
      newParams.set('sort', option)
      navigate(`${location.pathname}?${newParams.toString()}`)
    }
  }

  const initQuery = () => ({
    keyword: searchParams.get('q'),
    author: searchParams.get('author'),
    digest: !!searchParams.get('digest'),
    page: parseInt(searchParams.get('page') || '') || 1,
    sort: searchParams.get('sort') || 'relevance',
  })
  const [query, setQuery] = useState(initQuery())
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['search', 'threads', query],
    queryFn: () => searchThreads(query),
  })

  useEffect(() => {
    setQuery(initQuery())
    setSort(searchParams.get('sort') || 'relevance')
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

  if (isLoading) {
    return [...Array(15)].map((_, index) => (
      <Skeleton key={index} height={85} />
    ))
  }

  if (data && !data.total) {
    return <EmptyList text={'未找到相关帖子。'} />
  }

  return (
    <>
      {!!data?.rows?.length && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography variant="h6" sx={{ mb: 0 }}>
              搜索结果: {queryPrompt}
            </Typography>
            <Button
              type="button"
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
              onClick={handleSortClick}
              size="small"
              variant="outlined"
            >
              <span style={{ marginRight: 8 }}>Sort by:</span>
              {SORT_OPTIONS.find((opt) => opt.value === sort)?.label ||
                '支持数倒序（最多支持）'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleSortClose()}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={option.value === sort}
                  onClick={() => handleSortClose(option.value)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
          <Typography fontSize={12} color="grey">
            搜索到{data.total}条相关帖子
          </Typography>
          <Paper elevation={3} sx={{ borderRadius: '10px', mt: 1 }}>
            <List>
              {data.rows.map((item) => (
                <SearchResultItem
                  data={item}
                  key={item.thread_id}
                  showSummary
                  ignoreThreadHighlight
                />
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
    </>
  )
}

export default Thread
