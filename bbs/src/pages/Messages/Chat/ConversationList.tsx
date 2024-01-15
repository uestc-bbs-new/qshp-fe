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
}: {
  list: ChatConversation[]
  pagination?: PaginationParams
  lite?: boolean
  activeConversation?: ChatConversation
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <>
      <List disablePadding>
        {list.map((chat) => (
          <ConversationItem
            key={chat.conversation_id}
            chat={chat}
            lite={lite}
            selected={chat == activeConversation}
          />
        ))}
      </List>
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
