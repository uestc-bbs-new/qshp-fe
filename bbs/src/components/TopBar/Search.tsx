import React, { useEffect, useRef, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { Search } from '@mui/icons-material'
import {
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { searchUsers_at } from '@/apis/common'
import { Users } from '@/common/interfaces/response'

import SearchResultUser from './SearchUsers'

let timeout: any
const SearchBar = () => {
  const [searchType, setSearchType] = useState('post')
  const [searchText, setSearchText] = useState('')
  const [ifClick, setIfClick] = useState(0)
  const [show, setShow] = useState(true)
  const [data, setData] = useState<
    { total: number; rows: Users[] } | undefined
  >(undefined)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()
  const inputComponent = useRef<HTMLInputElement | null>(null)

  const handleSelect = (event: SelectChangeEvent) => {
    setSearchType(event.target.value)
    setData(undefined)
  }

  const handleSubmit = () => {
    setSearchText('')
    inputComponent.current?.blur()
    setShow(false)
    if (searchText.length > 0) {
      navigate({
        pathname: '/search',
        search: createSearchParams({
          type: searchType,
          name: searchText,
        }).toString(),
      })
    }
  }

  useEffect(() => {
    if (!ifClick) return
    document.getElementById('topbar-search')?.focus()
  }, [ifClick])

  useEffect(() => {
    if (searchType == 'username') handleSearchUser()
  }, [searchText])

  const handleSearchUser = () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      searchUsers_at({ page: 1, pagesize: 10, username: searchText }).then(
        (res) => {
          setData(res)
          setShow(true)
        }
      )
    }, 1000)
  }

  const handleFocus = () => {
    setIfClick(ifClick + 1)
    setAnchorEl(null)
    setOpen(false)
  }
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMouseLeave = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <Stack direction="column">
        <Stack
          direction="row"
          alignItems="center"
          className="rounded-lg bg-white/20 text-white transition-colors focus-within:bg-white focus-within:text-black"
          sx={{ minWidth: 420 }}
        >
          <FormControl
            sx={{ m: 1, minWidth: 80 }}
            size="small"
            variant="standard"
          >
            {/* <InputLabel className='text-white'>搜索</InputLabel> */}
            <Select
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              className="text-inherit"
              style={{
                textAlign: 'center',
                marginBottom: '-4px',
                marginRight: '10px',
              }}
              disableUnderline={true}
              value={searchType}
              onChange={handleSelect}
              label="Search"
            >
              <MenuItem value="post" onClick={handleFocus}>
                帖子
              </MenuItem>
              <MenuItem onMouseEnter={handleMouseEnter}>用户</MenuItem>
              <MenuItem value="username" sx={{ display: 'none' }}>
                用户名
              </MenuItem>
              <MenuItem value="uid" sx={{ display: 'none' }}>
                UID
              </MenuItem>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMouseLeave}
                MenuListProps={{
                  onMouseLeave: handleMouseLeave,
                }}
              >
                <MenuItem
                  value="username"
                  onClick={() => {
                    setSearchType('username'), handleFocus()
                  }}
                >
                  用户名
                </MenuItem>
                <MenuItem
                  value="uid"
                  onClick={() => {
                    setSearchType('uid'), handleFocus()
                  }}
                >
                  UID
                </MenuItem>
              </Menu>
            </Select>
          </FormControl>

          <Divider orientation="vertical" variant="middle" flexItem></Divider>
          <input
            className="flex-1 border-0 bg-transparent pl-4 text-inherit decoration-transparent placeholder-current outline-none"
            id="topbar-search"
            ref={inputComponent}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value)
              // if (searchType == 'user') handleSearchUser()
            }}
            onKeyDown={(event) => {
              event.key === 'Enter' && handleSubmit()
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
        <SearchResultUser
          status={searchType}
          data={data?.rows || []}
          total={data?.total || 0}
          show={show}
          setshow={setShow}
        />
      </Stack>
    </>
  )
}

export default SearchBar
