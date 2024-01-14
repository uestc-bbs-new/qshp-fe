import { useQuery } from '@tanstack/react-query'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { Paper, Skeleton } from '@mui/material'

import { getChatList } from '@/apis/common'

import Conversation from './Conversation'
import ConversationList from './ConversationList'

const tryParseInt = (value?: string) => {
  if (value == undefined) {
    return undefined
  }
  const parsedResult = parseInt(value)
  if (isNaN(parsedResult)) {
    return undefined
  }
  return parsedResult
}

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const chatId = tryParseInt(useParams()['plid'])
  const uid = tryParseInt(useParams()['uid'])
  const initQuery = () => {
    return {
      page: parseInt(searchParams.get('page') || '1') || 1,
    }
  }
  const [query, setQuery] = useState(initQuery())
  const { data: chatList } = useQuery({
    queryKey: ['messages', query],
    queryFn: () => getChatList(query),
    refetchOnMount: true,
  })

  useEffect(() => {
    setQuery(initQuery())
  }, [searchParams])

  return (
    <Paper sx={{ flexGrow: 1 }}>
      {chatId || uid ? (
        <Conversation
          chatId={chatId}
          uid={uid}
          initialList={query.page == 1 ? chatList?.rows : undefined}
        />
      ) : chatList ? (
        <ConversationList list={chatList.rows} pagination={chatList} />
      ) : (
        [...Array(10)].map((_, index) => <Skeleton key={index} height={70} />)
      )}
    </Paper>
  )
}

export default Chat
