import React, { useRef, useState, useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { Search } from '@mui/icons-material'
import { Divider, IconButton, Stack, Button, Box } from '@mui/material'
import { set } from 'react-hook-form'
import { h } from 'vue'

import { Users } from '@/common/interfaces/response'
import SearchResultUser from './SearchUsers'

let timeout: any
const SearchBar = () => {
  const [searchType, setSearchType] = useState<'post' | 'user'>('post')
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState<{ total: number; rows: Users[]; } | undefined>(undefined);

  const navigate = useNavigate()
  const inputComponent = useRef<HTMLInputElement | null>(null)

  const handleSubmit = () => {
    setSearchText('')
    inputComponent.current?.blur()

    if (searchText.length > 0) {
      navigate({
        pathname: '/search',
        search: createSearchParams({
          name: searchText,
        }).toString(),
      })
    }
  }


  const handleSearchType = () => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:4523/m1/1045892-0-default/forum/api/global/search/at`);
      const data = await response.json();
      setData(data.data);
    };
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fetchData();
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
          <Button
            className="ml-3 bg-opacity-40"
            variant="contained"
            style={{
              backgroundColor: searchType == 'post' ? '#89a9f6' : '#e6b3ff',
              marginRight: '10px',
            }}
            onClick={() => {
              setSearchType(searchType === 'post' ? 'user' : 'post')
              setData(undefined)
            }}
          >
            搜索{searchType == 'post' ? '帖子' : '用户'}
          </Button>

          <Divider orientation="vertical" variant="middle" flexItem></Divider>

          <input
            className="flex-1 border-0 bg-transparent pl-4 text-inherit decoration-transparent placeholder-current outline-none"
            ref={inputComponent}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value)
              if (searchType == 'user') handleSearchType()
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
        />
      </Stack>
    </>
  )
}

export default SearchBar
