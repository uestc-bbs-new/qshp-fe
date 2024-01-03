import React, { createRef, useMemo, useState } from 'react'
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

import { searchThreads } from '@/apis/common'
import { Thread } from '@/common/interfaces/response'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import Avatar from '../Avatar'

type Result = {
  thread?: Thread
  more?: boolean
  divider?: boolean
  user?: boolean
}

const kPreviewCount = 5

const SearchBar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSeacrhResults] = useState<Result[]>([])
  const searchAnchorRef = createRef<HTMLDivElement>()

  const fetch = useMemo(
    () =>
      debounce(
        async (keyword: string, callback: (threads: Thread[]) => void) => {
          setLoading(true)
          try {
            callback(
              (
                await searchThreads({
                  keyWord: keyword,
                  pageSize: kPreviewCount + 1,
                  pageNum: 1,
                })
              ).threads
            )
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
      navigate({
        pathname: '/search',
        search: createSearchParams({
          type: 'post',
          name: value,
        }).toString(),
      })
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
        ListboxProps={{ sx: { maxHeight: '500px' } }}
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
              } else if (option.more) {
                handleSubmit()
              } else if (option.user) {
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
                  <Avatar uid={option.thread.author_id} variant="rounded" />
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
            {option.divider && <Divider sx={{ width: '100%' }} />}
            {option.more && (
              <ListItemText>
                <Typography>更多结果...</Typography>
              </ListItemText>
            )}
            {option.user && (
              <ListItemText>
                <Typography>搜索用户...</Typography>
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
            return option.thread.thread_id.toString()
          }
          if (option.divider) {
            return 'divider'
          }
          if (option.more) {
            return 'more'
          }
          if (option.user) {
            return 'user'
          }
          return ''
        }}
        getOptionDisabled={(option) => !!option.divider}
        options={searchResults}
        onInputChange={async (_, value) => {
          setValue(value)
          if (value.trim()) {
            fetch(value, (threads) => {
              setSeacrhResults([
                ...threads
                  .slice(0, kPreviewCount)
                  .map((thread) => ({ thread })),
                ...(threads.length > kPreviewCount ? [{ more: true }] : []),
                { divider: true },
                { user: true },
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
