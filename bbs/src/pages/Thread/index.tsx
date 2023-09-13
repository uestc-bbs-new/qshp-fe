import Vditor from 'vditor'

import React, { useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { Box, Button, Stack, Typography } from '@mui/material'

import { getThreadsInfo } from '@/apis/thread'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import Editor from '@/components/Editor'

import Floor from './Floor'

function Thread() {
  const [vd, setVd] = useState<Vditor>()

  const handleSubmit = () => {
    console.log(vd?.getValue())
  }

  const location = useLocation()
  const thread_id = location.pathname.split('/').pop() as string
  const page = new URLSearchParams(location.search).get('page')
  const { data: info, isLoading: infoLoading } = useQuery(
    ['postDetails'],
    () => {
      return getThreadsInfo(thread_id, Number(page || '1'))
    }
  )

  const reply_floor = useRef(0)
  const set_reply = (floor: number) => {
    reply_floor.current = floor
    vd?.setValue(
      '> ' + info?.rows.find((item) => item.position === floor)?.message || ''
    )
  }

  return (
    <Box className="flex-1">
      <Box className="mb-6">
        <Box>
          <Chip text={'123'} />
          {info?.rows[0].subject || 'xxxx'}
        </Box>
        <Typography>TagIcon, Time, {info?.rows[0].author || 'xxxx'}</Typography>
      </Box>
      <Card className="mb-4 py-4">
        <>
          <Box>{info?.rows[0].message || 'xxxx'}</Box>
          {/* <Footer floor={0} set_reply={set_reply} /> */}
        </>
      </Card>
      <Card className="mb-4">
        <>
          <Floor floor={1} set_reply={set_reply}>
            <p>xxxx</p>
          </Floor>
        </>
      </Card>
      {info?.rows.map((item, index) => {
        return (
          <Card className="mb-4" key={item.position}>
            <>
              <Floor floor={item.position} set_reply={set_reply}>
                <p>item.message</p>
              </Floor>
            </>
          </Card>
        )
      })}

      <Card className="py-4">
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
              <Button variant="text" onClick={handleSubmit}>
                回复帖子
              </Button>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}
export default Thread
