import React, { useMemo, useRef, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { Search } from '@mui/icons-material'
import {
  Autocomplete,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
  debounce,
} from '@mui/material'

import { searchSummary } from '@/apis/search'
import {
  SearchSummaryResponse,
  SearchSummaryThread,
  SearchSummaryUser,
} from '@/common/interfaces/search'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'

type Result = {
  thread?: SearchSummaryThread
  moreThreads?: boolean
  divider?: boolean
  user?: SearchSummaryUser
  moreUsers?: boolean
  idMatch?: boolean
}

const kThreadPreviewCount = 5
const kUserPreviewCount = 3

const SearchBar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSeacrhResults] = useState<Result[]>([])
  const searchAnchorRef = useRef<HTMLDivElement>(null)

  const fetch = useMemo(
    () =>
      debounce(
        async (
          keyword: string,
          callback: (result: SearchSummaryResponse) => void
        ) => {
          setLoading(true)
          try {
            callback(await searchSummary(keyword))
          } finally {
            setLoading(false)
          }
        },
        400
      ),
    []
  )

  const handleSubmit = () => {
    if (value.trim()) {
      navigate(pages.searchThreads({ keyword: value }))
    }
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      className="rounded-lg bg-white/20 text-white transition-colors focus-within:bg-white focus-within:text-black"
      sx={{ minWidth: 420 }}
      ref={searchAnchorRef}
    >
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        loading={loading}
        fullWidth
        size="small"
        freeSolo
        ListboxProps={{ sx: { maxHeight: '640px' } }}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params?.InputProps,
              disableUnderline: true,
              className: 'text-white focus-within:text-black',
            }}
            variant="standard"
            sx={{ px: 2 }}
          />
        )}
        renderOption={(props, option) => (
          <li
            {...props}
            onClick={() => {
              if (option.divider) {
                return
              }
              setOpen(false)
              if (option.thread) {
                navigate(pages.thread(option.thread.thread_id))
              } else if (option.moreThreads) {
                handleSubmit()
              } else if (option.user) {
                navigate(pages.user({ uid: option.user.uid }))
              } else if (option.moreUsers) {
                navigate({
                  pathname: '/search',
                  search: createSearchParams({
                    type: 'username',
                    name: value,
                  }).toString(),
                })
              }
            }}
          >
            {option.thread && (
              <>
                <ListItemIcon>
                  <Avatar uid={option.thread.author_id} />
                </ListItemIcon>
                <ListItemText>
                  <Typography>{option.thread.subject}</Typography>
                  <Stack direction="row">
                    <Typography>{option.thread.author}</Typography>
                    <Typography ml={1.5}>
                      {chineseTime(option.thread.dateline * 1000)}
                    </Typography>
                  </Stack>
                </ListItemText>
              </>
            )}
            {option.user && (
              <>
                <ListItemIcon>
                  <Avatar uid={option.user.uid} />
                </ListItemIcon>
                <ListItemText>
                  <Typography>{option.user.username}</Typography>
                  <Stack direction="row">
                    <Typography>
                      {option.user.group_title}
                      {option.user.group_subtitle &&
                        ` (${option.user.group_subtitle})`}
                    </Typography>
                  </Stack>
                </ListItemText>
              </>
            )}
            {option.divider && <Divider sx={{ width: '100%' }} />}
            {option.moreThreads && (
              <ListItemText>
                <Typography>更多帖子...</Typography>
              </ListItemText>
            )}
            {option.moreUsers && (
              <ListItemText>
                <Typography>更多用户...</Typography>
              </ListItemText>
            )}
          </li>
        )}
        getOptionLabel={(option) =>
          (typeof option == 'object' &&
            option.thread &&
            option.thread.subject) ||
          value
        }
        getOptionKey={(option) => {
          if (typeof option == 'string') {
            return option
          }
          if (option.thread) {
            return (
              option.thread.thread_id.toString() + (option.idMatch ? '!' : '')
            )
          }
          if (option.user) {
            return option.user.uid.toString() + (option.idMatch ? '!' : '')
          }
          if (option.divider) {
            return 'divider'
          }
          if (option.moreThreads) {
            return 'moreThreads'
          }
          if (option.moreUsers) {
            return 'moreUsers'
          }
          return ''
        }}
        getOptionDisabled={(option) => !!option.divider}
        options={searchResults}
        onInputChange={async (_, value) => {
          setValue(value)
          if (value.trim()) {
            fetch(value, (result) => {
              setSeacrhResults([
                ...(result.tid_match
                  ? [{ idMatch: true, thread: result.tid_match }]
                  : []),
                ...(result.uid_match
                  ? [{ idMatch: true, user: result.uid_match }]
                  : []),
                ...(result.threads
                  ?.slice(0, kThreadPreviewCount)
                  ?.map((thread) => ({ thread })) || []),
                ...(result.thread_count > kThreadPreviewCount
                  ? [{ moreThreads: true }]
                  : []),
                { divider: true },
                ...(result.users
                  ?.slice(0, kUserPreviewCount)
                  ?.map((user) => ({ user })) || []),
                ...(result.user_count > kUserPreviewCount
                  ? [{ moreUsers: true }]
                  : []),
              ])
            })
          }
        }}
      />

      <Divider orientation="vertical" variant="middle" flexItem></Divider>

      <IconButton
        className="text-inherit"
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleSubmit}
      >
        <Search className="text-inherit" />
      </IconButton>
    </Stack>
  )
}

export default SearchBar
