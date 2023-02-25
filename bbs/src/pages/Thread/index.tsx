import React, { useState } from 'react'
import { Box, Typography, Divider, Stack, Button } from '@mui/material'

import { default as BBCodePreview } from 'bbcode-to-react'

import Floor from './Floor'
import Footer from './Footer'
import Editor from '@/components/Editor'
import Chip from '@/components/Chip'
import Avatar from '@/components/Avatar'
import UserCard from '@/components/UserCard'
import Vditor from 'vditor'

function Thread() {
  const [vd, setVd] = useState<Vditor>()

  const handleSubmit = () => {
    console.log(vd?.getValue())
  }

  return (
    <>
      <Box className="mb-6">
        <Box>
          <Chip text={'123'} />
          {'title'}
        </Box>
        <Typography>TagIcon, Time, Author</Typography>
      </Box>
      <Box className="bg-white p-4 shadow mb-4">
        <Box>content</Box>
        <Footer floor={0} />
      </Box>
      <Box className="bg-white rounded drop-shadow-md p-3">
        <Floor>
          <p>sadfsa</p>
        </Floor>
        <Divider />
      </Box>
      <Stack direction="row" className="p-4 shadow">
        <UserCard uid={1}>
          <Avatar
            className="mr-4"
            alt="Remy Sharp"
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={{ width: 120, height: 120 }}
            variant="rounded"
          />
        </UserCard>
        <Box className="flex-1">
          <Editor setVd={setVd} minHeight={150} />
          <Box className="text-right">
            <Button onClick={handleSubmit}>回复帖子</Button>
          </Box>
        </Box>
      </Stack>
    </>
  )
}
export default Thread
