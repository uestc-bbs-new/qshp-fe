import { useQuery } from '@tanstack/react-query'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { RemoveCircle } from '@mui/icons-material'
import {
  Badge,
  Box,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'

import { getUserProfile } from '@/apis/user'
import { Visitor } from '@/common/interfaces/user'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

import { SubPageCommonProps } from './types'

const VisitorAvatar = ({ user }: { user: Visitor }) => (
  <Avatar alt={user.username} uid={user.uid} size={40} variant="rounded" />
)

export const VisitorList = ({
  visitors,
  visits,
  wide,
}: {
  visitors?: Visitor[]
  visits?: number
  wide?: boolean
}) => {
  const { state } = useAppState()
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <>
      <Grid container spacing={0.75}>
        {visitors?.map((user) => (
          <Grid
            item
            xs={4}
            sm={wide ? 3 : undefined}
            md={wide ? 2 : undefined}
            lg={wide ? 1 : undefined}
            key={user.uid}
          >
            <Stack
              component={Link}
              to={pages.user({ uid: user.uid })}
              underline="none"
              alignItems="center"
            >
              {user.uid == state.user.uid ? (
                <Badge
                  badgeContent={
                    <Tooltip title="删除访问记录">
                      <IconButton
                        color="warning"
                        size="small"
                        onClick={(e) => {
                          e.preventDefault()
                          setSearchParams(
                            searchParamsAssign(searchParams, {
                              additional: 'removevlog',
                            })
                          )
                        }}
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <VisitorAvatar user={user} />
                </Badge>
              ) : (
                <VisitorAvatar user={user} />
              )}
              <Typography
                fontSize={12}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxWidth="100%"
              >
                {user.username}
              </Typography>
              <Typography fontSize={12} color="rgb(161, 173, 197)">
                {chineseTime(user.dateline * 1000, { short: true })}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
      {!!visits && (
        <Typography mt={1} color="rgba(96, 98, 102, 0.8)" px={0.5}>
          已有 {visits} 人次来访
        </Typography>
      )}
    </>
  )
}

const Visitors = ({
  userQuery,
  queryOptions,
  onLoad,
  visitors,
  visits,
}: SubPageCommonProps & {
  visitors?: Visitor[]
  visits?: number
}) => {
  const initQuery = () => ({ common: { ...userQuery, ...queryOptions } })
  const [query, setQuery] = useState(initQuery())
  const removeVisitLogRef = useRef(query.common.removeVisitLog)
  const { refetch } = useQuery({
    queryKey: ['user', 'profile', query],
    queryFn: async () => {
      const data = await getUserProfile(query.common)
      removeVisitLogRef.current = query.common.removeVisitLog
      onLoad && onLoad(data)
      return data
    },
    enabled: !visitors,
  })

  const [searchParams] = useSearchParams()
  useEffect(() => {
    setQuery(initQuery())
  }, [
    searchParams,
    userQuery.uid,
    userQuery.username,
    userQuery.removeVisitLog,
    userQuery.admin,
  ])
  useEffect(() => {
    if (query.common.removeVisitLog != removeVisitLogRef.current) {
      refetch()
    }
  }, [query.common.removeVisitLog])
  return (
    <Box py={2}>
      <VisitorList visitors={visitors} visits={visits} wide />
    </Box>
  )
}
export default Visitors
