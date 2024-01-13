import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  List,
  ListItem,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import { getChatList } from '@/apis/common'
import Avatar from '@/components/Avatar'
import { chineseTime } from '@/utils/dayjs'
import { searchParamsAssign } from '@/utils/tools'

const Pm = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const chatId = useParams()['plid']
  const initQuery = () => {
    return {
      page: parseInt(searchParams.get('page') || '1') || 1,
    }
  }
  const [query, setQuery] = useState(initQuery())
  const { data } = useQuery(['messages', query], {
    queryFn: () => getChatList(query),
    refetchOnMount: true,
  })

  useEffect(() => {
    setQuery(initQuery())
  }, [searchParams])

  return (
    <Paper sx={{ flexGrow: 1 }}>
      <List>
        {data?.rows.map((chat, index) => (
          <ListItem key={chat.conversation_id}>
            <Stack direction="row">
              <Avatar variant="rounded" uid={chat.author_id} />
              <Stack ml={2}>
                <Typography>{chat.to_username}</Typography>
                <Typography>{chat.last_summary}</Typography>
                <Typography>
                  {chineseTime(chat.last_dateline * 1000)}
                </Typography>
              </Stack>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Stack alignItems="center" my={1.5}>
        <Pagination
          boundaryCount={3}
          siblingCount={1}
          count={Math.ceil((data?.total || 1) / (data?.page_size || 1))}
          page={query.page}
          onChange={(_, page) =>
            setSearchParams(searchParamsAssign(searchParams, { page }))
          }
        />
      </Stack>
    </Paper>
  )
}
export default Pm
