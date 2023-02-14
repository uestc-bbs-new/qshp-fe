import { InputBase, IconButton, Stack, Backdrop } from '@mui/material'
import React, { useState, useEffect } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'

const Search = () => {
  // const [] = useContext()

  const [searchText, setSearchText] = useState('')
  const [timer, setTimer] = useState(null)

  const search = () => {
    console.log(searchText)
  }

  useEffect(() => {
    // 清除防抖定时
    if (timer !== null) {
      clearTimeout(timer)
    }

    // 进行搜索
    // if (searchText !== '') {
    //   setTimer(setTimeout(search, 500))
    // }
  }, [searchText])

  return (
    <>
      <Stack
        direction="row"
        className="bg-slate-300 focus-within:bg-white w-96 transition-colors rounded"
      >
        {/* <IconButton sx={{ p: "10px" }} aria-label="menu">
          <MenuIcon />
        </IconButton> */}
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          fullWidth
          placeholder="Search"
          defaultValue={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </Stack>
      {/* <Backdrop>
        
      </Backdrop> */}
    </>
  )
}

export default Search
