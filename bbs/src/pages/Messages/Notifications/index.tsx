import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom'

import {
  List,
  Pagination,
  Paper,
  Stack,
  Tab,
  TabProps,
  Tabs,
} from '@mui/material'

import { getNotifications } from '@/apis/common'
import { MessageCounts } from '@/common/interfaces/response'
import Link from '@/components/Link'
import { pages, useActiveRoute } from '@/utils/routes'
import { searchParamsAssign } from '@/utils/tools'

import NotificationItem from './NotificationItem'

type NotificationKindDefinition = { id: string; text: string }

const kinds = {
  posts: [
    { id: 'reply', text: '回复' },
    { id: 'comment', text: '点评' },
    { id: 'at', text: '提到我的' },
    { id: 'rate', text: '评分' },
    { id: 'post_other', text: '其他' },
  ],
  system: [
    { id: 'friend', text: '好友' },
    { id: 'space', text: '个人空间' },
    { id: 'task', text: '任务' },
    { id: 'report', text: '举报' },
    { id: 'system', text: '系统提醒' },
    { id: 'admin', text: '公共消息' },
    { id: 'app', text: '应用提醒' },
  ],
}
const kDefaultGroup = 'posts'

const Notifications = () => {
  const route = useActiveRoute()
  const [searchParams, setSearchParams] = useSearchParams()
  const groupName = (route && (route.id as NotificationGroup)) || kDefaultGroup
  const kindName = useParams()['kind'] || kinds[groupName][0].id
  const initQuery = () => {
    return {
      kind: kindName,
      page: parseInt(searchParams.get('page') || '1') || 1,
    }
  }
  const [query, setQuery] = useState(initQuery())
  const { data, isFetchedAfterMount } = useQuery({
    queryKey: ['messages', query],
    queryFn: () => getNotifications(query),
    refetchOnMount: true,
  })
  const totalPages = Math.ceil((data?.total || 1) / (data?.page_size || 1))

  const [newMessages, setNewMessages] = useState<MessageCounts>()
  const { setCount } = useOutletContext<{
    setCount: React.Dispatch<React.SetStateAction<MessageCounts | undefined>>
  }>()
  useEffect(() => {
    if (isFetchedAfterMount && data?.new_messages) {
      setNewMessages(data.new_messages)
      setCount(data.new_messages)
    }
  }, [data])

  useEffect(() => {
    setQuery(initQuery())
  }, [groupName, kindName, searchParams])

  return (
    <Paper sx={{ flexGrow: 1, p: 1 }}>
      <Tabs value={kindName}>
        {kinds[groupName].map((kind) => (
          <KindTab
            key={kind.id}
            value={kind.id}
            groupName={groupName}
            kind={kind}
            newMessages={newMessages}
          />
        ))}
      </Tabs>
      <List>
        {data?.rows.map((item, index) => (
          <NotificationItem key={index} item={item} />
        ))}
      </List>
      {totalPages > 1 && (
        <Stack alignItems="center" my={1.5}>
          <Pagination
            boundaryCount={3}
            siblingCount={1}
            count={totalPages}
            page={query.page}
            onChange={(_, page) =>
              setSearchParams(searchParamsAssign(searchParams, { page }))
            }
          />
        </Stack>
      )}
    </Paper>
  )
}

const KindTab = ({
  groupName,
  kind,
  newMessages,
  ...tabProps
}: {
  groupName: NotificationGroup
  kind: NotificationKindDefinition
  newMessages?: MessageCounts
} & TabProps) => {
  const count =
    newMessages &&
    (newMessages[groupName] as { [kind: string]: number })[kind.id]
  const label = (
    <>
      {kind.text}
      {!!count && ` (${count})`}
    </>
  )
  return (
    <Tab
      component={Link}
      to={pages.notifications(groupName, kind.id)}
      label={
        count ? <span style={{ fontWeight: 'bold' }}>{label}</span> : label
      }
      {...tabProps}
    />
  )
}

export default Notifications
