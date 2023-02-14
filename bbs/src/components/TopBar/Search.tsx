import { InputBase, IconButton, Stack, Divider } from '@mui/material'
import React, { useState, useRef } from 'react'
import { Search } from '@mui/icons-material'
import { useNavigate, createSearchParams } from 'react-router-dom'

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
      className="bg-white/20 text-white focus-within:bg-white focus-within:text-black w-96 transition-colors rounded-lg"
    >
      <input
        className="outline-none border-0 pl-4 flex-1 text-inherit bg-transparent decoration-transparent placeholder-current"
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
