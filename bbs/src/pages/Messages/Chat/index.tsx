import { useQuery } from '@tanstack/react-query'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import SettingsIcon from '@mui/icons-material/Settings'
import { Button, Paper, Skeleton } from '@mui/material'

import { getChatList } from '@/apis/messages'
import Link from '@/components/Link'
import { useSignInChange } from '@/states'
import { pages } from '@/utils/routes'

import Conversation from './Conversation'
import ConversationList from './ConversationList'
import Report from './ConversationReport'

const buttonProps = {
  backgroundColor: 'inherit',
  border: 'none',
  fontSize: '14px',
}

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
  const [showOptSelect, setShowOptSelect] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)
  const [selectedConversations, setSelectedConversations] = useState({})

  const toggleOptSelect = () => {
    setShowOptSelect((prev) => !prev)
  }

  const initQuery = () => {
    return {
      page: parseInt(searchParams.get('page') || '1') || 1,
    }
  }
  const [query, setQuery] = useState(initQuery())
  const { data: chatList, refetch } = useQuery({
    queryKey: ['messages', query],
    queryFn: () => getChatList(query),
    refetchOnMount: true,
  })

  useEffect(() => {
    setQuery(initQuery())
  }, [searchParams])
  useSignInChange(refetch)

  const handleCheckboxChange = (checked: boolean, id: number) => {
    setSelectedCount((prevCount) => (checked ? prevCount + 1 : prevCount - 1))
    setSelectedConversations((prev) => ({ ...prev, [id]: checked }))
  }

  return (
    <Paper sx={{ flexGrow: 1 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            padding: '0px',
            margin: '0px',
          }}
        >
          <Button
            {...buttonProps}
            sx={(theme) => ({
              margin: '8px',
              width: 'auto',
              color: theme.palette.mode == 'light' ? '#0268FD' : '#90CAF9',
            })}
            onClick={toggleOptSelect}
          >
            {showOptSelect ? '取消选择' : '选择消息'}
          </Button>
          {showOptSelect && (
            <>
              <Button
                {...buttonProps}
                sx={(theme) => ({
                  color: theme.palette.mode == 'light' ? '#0268FD' : '#90CAF9',
                })}
                disabled={selectedCount === 0}
              >
                设为已读
              </Button>
              <Button
                {...buttonProps}
                sx={(theme) => ({
                  color: theme.palette.mode == 'light' ? '#E26666' : '#DF6A6A',
                })}
                disabled={selectedCount === 0}
              >
                删除
              </Button>
              {selectedCount === 1 && (
                <Report selectedCount={selectedCount}></Report>
              )}
            </>
          )}
        </p>
        <Link to={pages.settings('blacklist')}>
          <Button
            sx={(theme) => ({
              marginRight: '20px',
              width: 'auto',
              backgroundColor: 'inherit',
              border: 'none',
              fontSize: '14px',
              color: theme.palette.mode == 'light' ? '#0268FD' : '#90CAF9',
            })}
          >
            <SettingsIcon sx={{ marginRight: '4px', width: '18px' }} />
            设置
          </Button>
        </Link>
      </div>
      {chatId || uid ? (
        <Conversation
          onCheckboxChange={handleCheckboxChange}
          chatId={chatId}
          uid={uid}
          initialList={query.page == 1 ? chatList?.rows : undefined}
          checkList={selectedConversations}
          page={query.page}
          showOptSelect={showOptSelect}
        />
      ) : chatList ? (
        <ConversationList
          onCheckboxChange={handleCheckboxChange}
          list={chatList.rows}
          checkList={selectedConversations}
          pagination={chatList}
          showOptSelect={showOptSelect}
        />
      ) : (
        [...Array(10)].map((_, index) => <Skeleton key={index} height={70} />)
      )}
    </Paper>
  )
}

export default Chat
