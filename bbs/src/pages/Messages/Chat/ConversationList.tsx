import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { List, Pagination, Stack } from '@mui/material'

import {
  ChatConversation,
  PaginationParams,
} from '@/common/interfaces/response'
import { searchParamsAssign } from '@/utils/tools'

import ConversationItem from './ConversationItem'

const ConversationList = ({
  list,
  pagination,
  lite,
  activeConversation,
  showOptSelect,
  checkList,
  onCheckboxChange,
}: {
  list: ChatConversation[]
  pagination?: PaginationParams
  lite?: boolean
  activeConversation?: ChatConversation
  showOptSelect: boolean
  checkList: Record<number, boolean>
  onCheckboxChange: (isChecked: boolean, id: number) => void
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeRef.current])
  return (
    <>
      <List>
        {list.map((chat) => (
          <ConversationItem
            key={chat.conversation_id}
            chat={chat}
            lite={lite}
            selected={chat == activeConversation}
            ref={chat == activeConversation ? activeRef : undefined}
            showOptSelect={showOptSelect}
            checked={checkList[chat.conversation_id] || false}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
      </List>
      {/* 分页栏 */}
      {pagination && (
        <Stack alignItems="center" my={1.5}>
          <Pagination
            boundaryCount={3}
            siblingCount={1}
            count={Math.ceil(
              (pagination.total || 1) / (pagination.page_size || 1)
            )}
            page={pagination.page}
            onChange={(_, page) =>
              setSearchParams(searchParamsAssign(searchParams, { page }))
            }
          />
        </Stack>
      )}
    </>
  )
}

export default ConversationList
