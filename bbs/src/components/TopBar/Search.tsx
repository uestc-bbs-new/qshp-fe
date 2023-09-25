import React, { useEffect, useRef, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { BorderBottom, Search } from '@mui/icons-material'
import { Divider, IconButton, Stack, MenuItem, FormControl, InputLabel } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Users } from '@/common/interfaces/response'
import SearchResultUser from './SearchUsers'
import { searchUsers_at } from '@/apis/common'

let timeout: any
const SearchBar = () => {
  const [searchType, setSearchType] = useState('post')
  const [searchText, setSearchText] = useState('')
  const [show, setShow] = useState(true)
  const [data, setData] = useState<{ total: number; rows: Users[]; } | undefined>(undefined);

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
    if (searchType == 'user') handleSearchUser()
  }, [searchText])

  const handleSearchUser = () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      searchUsers_at({ page: 1, pagesize: 10, username: searchText }).then((res) => {
        setData(res);
        setShow(true);
      })
    }, 1000)
  }

  return (
    <>
      <Stack direction="column">
        <Stack
          direction="row"
          alignItems="center"
          className="w-96 rounded-lg bg-white/20 text-white transition-colors focus-within:bg-white focus-within:text-black"
        >

          <FormControl sx={{ m: 1, minWidth: 80 }} size="small" variant="standard">
            {/* <InputLabel className='text-white'>搜索</InputLabel> */}
            <Select
              className="text-inherit"
              style={{
                textAlign: "center",
                marginBottom: '-4px',
                marginRight: '10px',
              }}
              disableUnderline={true}
              value={searchType}
              onChange={handleSelect}
              label="Search"
            >
              <MenuItem value="post">帖子</MenuItem>
              <MenuItem value="user">用户</MenuItem>
            </Select>
          </FormControl>

          <Divider orientation="vertical" variant="middle" flexItem></Divider>
          <input
            className="flex-1 border-0 bg-transparent pl-4 text-inherit decoration-transparent placeholder-current outline-none"
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
      </Stack >
    </>
  )
}

export default SearchBar
