import { List, Box, Typography, useTheme, MenuItem, Stack } from '@mui/material'

import { Users } from '@/common/interfaces/response'
import Avatar from '../Avatar'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

type resultUserProps = {
  status: string
  data: Users[]
  total: number
  show: boolean
  setshow: React.Dispatch<React.SetStateAction<boolean>>
}
const SearchResultUser = ({
  status,
  data,
  show,
  setshow,
}: resultUserProps) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const boxRef = useRef();
  const handleSubmit = (item: Users) => {
    setshow(false)
    navigate({
      pathname: '/search',
      search: createSearchParams({
        type: "user",
        name: item.username,
      }).toString(),
    })
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setshow(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef])

  if (data.length == 0 || status == 'post' || !show)
    return <></>
  return (
    <Box
      ref={boxRef}
      className={`rounded-lg shadow-lg p-2`}
      style={{
        width: 300,
        position: 'absolute',
        top: 70,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <List>
        {data.map((item) => (
          <Box key={item.user_id} >
            <MenuItem onClick={(e) => handleSubmit(item)}>
              <Stack direction="row" >
                <Avatar
                  className="mx-3"
                  uid={item.user_id}
                  sx={{ width: 32, height: 32 }}
                  variant="rounded"
                />
                <Typography color="text.secondary">{item.username}</Typography>
              </Stack>
            </MenuItem>
          </Box>
        ))}
      </List>
    </Box>
  )
}


export default SearchResultUser
