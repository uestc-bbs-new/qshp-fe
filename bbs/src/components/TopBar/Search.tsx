import React, { useRef, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { Search } from '@mui/icons-material'
import { Divider, IconButton, Stack } from '@mui/material'

const SearchBar = () => {
  const [searchText, setSearchText] = useState('')
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

  return (
    <Stack
      direction="row"
      alignItems="center"
      className="w-96 rounded-lg bg-white/20 text-white transition-colors focus-within:bg-white focus-within:text-black"
    >
      <input
        className="flex-1 border-0 bg-transparent pl-4 text-inherit decoration-transparent placeholder-current outline-none"
        placeholder="搜索帖子"
        ref={inputComponent}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
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
  )
}

export default SearchBar
