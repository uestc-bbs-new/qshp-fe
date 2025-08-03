import React, { useState } from 'react'

import {
  Box,
  Paper,
  Stack,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Typography,
} from '@mui/material'

import { ThreadBasics, TopListKey } from '@/common/interfaces/response'
import { useAppState } from '@/states'
import { topListTitleMap } from '@/utils/constants'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'

const kCount = 8

const HeaderCardBase = ({
  header,
  list,
  filteredCount,
}: {
  header: React.ReactNode
  list: React.ReactNode
  filteredCount?: number
}) => (
  <Box className="relative overflow-hidden p-1" style={{ width: '100%' }}>
    <Paper elevation={3}>
      {header}
      {list}
    </Paper>
    {!!filteredCount && (
      <Typography
        sx={{
          position: 'absolute',
          right: '0.25em',
          bottom: '0.25em',
          borderRadius: '100%',
          width: '1.5em',
          lineHeight: '1.5em',
          height: '1.5em',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          color: 'white',
          textAlign: 'center',
          transform: 'scale(0.72)',
        }}
      >
        -{filteredCount}
      </Typography>
    )}
  </Box>
)

const TopListView = ({
  id,
  list,
  sx,
}: {
  id: TopListKey
  list?: ThreadBasics[]
  sx?: SxProps<Theme>
}) => (
  <Stack direction="column" sx={sx}>
    {list?.slice(0, kCount).map((thread, index) => (
      <Stack key={index} direction="row" sx={{ my: 0.5 }}>
        <Box className="p-1">
          <Box sx={{ mx: 1 }}>
            <Link
              to={thread.author_id ? `/user/${thread.author_id}` : undefined}
            >
              <Avatar alt={thread.author} uid={thread.author_id} size={35} />
            </Link>
          </Box>
        </Box>
        <Box className="flex-1" minWidth="1em" mr={2}>
          <Stack direction="column">
            <Link
              to={pages.thread(thread.thread_id)}
              state={{ fromTopList: id }}
              color="inherit"
              underline="hover"
            >
              <Box>
                <Typography
                  sx={{
                    mt: 0.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {thread.subject}
                </Typography>
              </Box>
            </Link>
            <Typography
              sx={{
                fontSize: 12,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '210px',
              }}
              color="grey"
            >
              {thread.summary}
            </Typography>
          </Stack>
        </Box>
        <Link
          fontSize={12}
          fontWeight={600}
          className="mr-5 mt-3"
          underline="hover"
          to={thread.author_id ? `/user/${thread.author_id}` : undefined}
          sx={thread.author_id == 0 ? { cursor: 'pointer' } : null}
        >
          {thread.author}
        </Link>
      </Stack>
    ))}
  </Stack>
)

const HeaderCard = ({ id, list }: { id: TopListKey; list: ThreadBasics[] }) => {
  const { state } = useAppState()
  const feSettings = state.feSettings
  let filteredCount = 0
  let unfilteredCount = 0
  const filteredList = list.filter((thread) => {
    let result = true
    if (id == 'digest') {
      return result
    }
    if (
      feSettings?.user_blacklist?.some((item) => thread.author_id == item.uid)
    ) {
      result = false
    } else if (feSettings?.forum_blacklist?.includes(thread.forum_id)) {
      result = false
    } else if (
      feSettings?.keyword_blackilst?.some(
        (item) =>
          thread.subject.includes(item.kw) ||
          (item.include_summary && thread.summary?.includes(item.kw))
      )
    ) {
      result = false
    }
    if (result) {
      ++unfilteredCount
    } else if (unfilteredCount < kCount) {
      ++filteredCount
    }
    return result
  })
  return (
    <HeaderCardBase
      header={
        <Stack
          direction="row"
          className="pt-3 px-8 pb-2"
          sx={(theme) => ({ ...theme.commonSx.headerCardGradient })}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            {topListTitleMap[id]}
          </Typography>
        </Stack>
      }
      list={<TopListView id={id} list={filteredList} />}
      filteredCount={filteredCount}
    />
  )
}

export const TabbedHeaderCard = ({
  ids,
  initialId,
  topLists,
}: {
  ids: TopListKey[]
  initialId?: TopListKey
  topLists: { [id: string]: ThreadBasics[] | undefined }
}) => {
  const [activeId, setActiveId] = useState(initialId ?? ids[0])
  return (
    <HeaderCardBase
      header={
        <Box sx={(theme) => ({ ...theme.commonSx.headerCardGradient })}>
          <Tabs value={activeId} onChange={(_, value) => setActiveId(value)}>
            {ids.map((id) => (
              <Tab
                key={id}
                value={id}
                label={topListTitleMap[id]}
                sx={{ fontSize: 16, '&.Mui-selected': { fontWeight: 'bold' } }}
              />
            ))}
          </Tabs>
        </Box>
      }
      list={
        <TopListView
          id={activeId}
          list={topLists[activeId]}
          sx={{ pt: 0.75, pb: 0.25 }}
        />
      }
    />
  )
}

export default HeaderCard
