import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import {
  List,
  ListItemButton,
  Paper,
  Stack,
  useMediaQuery,
} from '@mui/material'

import { MessageCounts } from '@/common/interfaces/response'
import Link from '@/components/Link'
import { isPreviewRelease } from '@/utils/releaseMode'
import {
  mapMessagesRouteToMessageGroup,
  messagesSubPages,
  pages,
  useActiveRoute,
} from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'

import StartConversation from './Chat/StartConversation'

const Messages = () => {
  const route = useActiveRoute()
  const [count, setCount] = useState<MessageCounts>()
  const countMembers = (obj: { [kind: string]: number } | undefined) => {
    if (!obj) {
      return
    }
    return Object.entries(obj).reduce((result, [k, v]) => result + v, 0)
  }
  const counts: { [group: string]: number | undefined } = {
    chat: count?.chat,
    posts: countMembers(count?.posts),
    system: countMembers(count?.system),
  }
  const narrowView = useMediaQuery('(max-width: 800px)')

  return (
    <Stack direction="row" alignItems="flex-start" mt={2}>
      <Stack direction="column" alignItems="flex-start" spacing={2} mr={4}>
        {!narrowView && (
          <Paper sx={{ width: 180, mr: 4, flewGrow: 0, flexShrink: 0 }}>
            <List disablePadding>
              {messagesSubPages.map((item, index) => (
                <Link
                  underline="none"
                  color="inherit"
                  key={index}
                  to={
                    isPreviewRelease && item.id == 'chat'
                      ? `${siteRoot}/home.php?mod=space&do=pm`
                      : pages.messages(item.id as MessageGroup)
                  }
                  external={isPreviewRelease && item.id == 'chat'}
                  target={
                    isPreviewRelease && item.id == 'chat' ? '_blank' : undefined
                  }
                >
                  <ListItemButton
                    selected={item.id == mapMessagesRouteToMessageGroup(route)}
                  >
                    {item.text}
                    {!!counts[item.id] && ` (${counts[item.id]})`}
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Paper>
        )}
        <StartConversation />
      </Stack>
      <Outlet context={{ setCount }} />
    </Stack>
  )
}

export default Messages
