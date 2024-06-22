import { useQuery } from '@tanstack/react-query'

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  Box,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { searchUsers } from '@/apis/search'
import { SearchSummaryUser } from '@/common/interfaces/search'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import EmptyList from '@/components/EmptyList'
import Link from '@/components/Link'
import { pages } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

const UserItem = ({ data }: { data: SearchSummaryUser }) => {
  const theme = useTheme()
  return (
    <Link
      to={pages.user({ uid: data.uid })}
      className="rounded-lg shadow-lg p-6"
      underline="none"
      sx={{
        display: 'block',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack direction="row">
        <Avatar alt={data.username} uid={data.uid} size={54} sx={{ mr: 2 }} />
        <Stack alignItems="flex-start">
          <Typography variant="authorName" mb={0.5}>
            {data.username}
          </Typography>
          <Stack direction="row" flexWrap="wrap">
            <Chip text={`${data.group_title}`} />
            {data.group_subtitle && (
              <Typography variant="authorGroupSubtitle">
                （{data.group_subtitle}）
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Link>
  )
}

const User = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initQuery = () => ({
    query: searchParams.get('q'),
    page: parseInt(searchParams.get('page') || '') || 1,
  })
  const [query, setQuery] = useState(initQuery())
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['search', 'threads', query],
    queryFn: () => searchUsers(query),
  })

  useEffect(() => {
    setQuery(initQuery())
  }, [searchParams])

  const thinView = useMediaQuery('(max-width: 560px)')

  if (isLoading) {
    return [...Array(10)].map((_, index) => <Skeleton key={index} />)
  }

  if (data && !data.total) {
    return <EmptyList text={'未找到相关用户。'} />
  }

  if (!data?.rows?.length) {
    return <></>
  }

  return (
    <Box className="flex-1">
      <Typography my={1.5}>搜索结果: {query.query}</Typography>
      <Box>
        <Grid container spacing={2}>
          {data?.rows.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <UserItem data={item} key={item.uid} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Stack alignItems="center">
        <Pagination
          boundaryCount={thinView ? 1 : 3}
          siblingCount={1}
          page={data.page}
          count={Math.ceil(data.total / (data.page_size || 1))}
          sx={{ my: 2 }}
          onChange={(_, page) =>
            navigate(
              `${location.pathname}?${searchParamsAssign(searchParams, {
                page,
              })}`
            )
          }
        />
      </Stack>
    </Box>
  )
}

export default User
