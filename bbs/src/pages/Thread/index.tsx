import { default as BBCodePreview } from 'bbcode-to-react'
import Vditor from 'vditor'

import React, { useState } from 'react'

import { Box, Button, Divider, Stack, Typography } from '@mui/material'

import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import Editor from '@/components/Editor'
import UserCard from '@/components/UserCard'

import Floor from './Floor'
import Footer from './Footer'

function Thread() {
  const [vd, setVd] = useState<Vditor>()

  const handleSubmit = () => {
    console.log(vd?.getValue())
  }

  return (
    <Box className="flex-1">
      <Box className="mb-6">
        <Box>
          <Chip text={'123'} />
          {'title'}
        </Box>
        <Typography>TagIcon, Time, Author</Typography>
      </Box>
      <Card>
        <>
          <Box>content</Box>
          <Footer floor={0} />
        </>
      </Card>
      <Card>
        <>
          <Floor>
            <p>sadfsa</p>
          </Floor>
        </>
      </Card>
      <Card>
        <Stack direction="row">
          <Avatar
            className="mr-4"
            alt="test"
            uid={1}
            sx={{ width: 120, height: 120 }}
            variant="rounded"
          />
          <Box className="flex-1">
            <Editor setVd={setVd} minHeight={150} />
            <Box className="text-right">
              <Button onClick={handleSubmit}>回复帖子</Button>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}
export default Thread
