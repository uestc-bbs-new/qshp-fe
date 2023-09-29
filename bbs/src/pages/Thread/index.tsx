import dayjs from 'dayjs'
import Vditor from 'vditor'

import React, { useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useSearchParams } from 'react-router-dom'

import { Box, Button, Pagination, Stack } from '@mui/material'

import { getThreadsInfo, replyThreads } from '@/apis/thread'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Editor from '@/components/Editor'

import Floor from './Floor'
import { ParsePost } from './ParserPost'

function Thread() {
  const [vd, setVd] = useState<Vditor>()

  const handleSubmit = async () => {
    if (vd?.getValue()) {
      await replyThreads(
        Number(thread_id),
        reply_floor.current.post_id,
        vd?.getValue()
      )
    }
  }

  const location = useLocation()

  const thread_id = location.pathname.split('/').pop() as string
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: info, isLoading: infoLoading } = useQuery(
    ['postDetails'],
    () => {
      return getThreadsInfo(thread_id, Number(searchParams.get('page') || '1'))
    }
  )

  const reply_floor = useRef({
    floor: 1,
    post_id: 1,
  })
  const set_reply = (floor: number) => {
    reply_floor.current.floor = floor
    const reply_item = info?.rows.find((item) => item.position === floor)
    let msg = reply_item?.message || ''
    reply_floor.current.post_id = reply_item?.post_id || 1

    // 正则处理回复信息
    const exp = /\[\/quote\]\n\n([\s\S]*)/
    msg = exp.test(msg) ? exp.exec(msg)![1] : msg
    vd?.setValue(
      `> ${info?.rows.find((item) => item.position === floor)?.author || ''}
      ${msg}\n
      `
    )
    vd?.focus()
  }

  return (
    <Box className="flex-1">
      {/* <Box className="mb-6">
        <Box>
          <Chip text={'123'} />
          {info?.rows[0].subject || 'xxxx'}
        </Box>
        <Typography>TagIcon, Time, {info?.rows[0].author || 'xxxx'}</Typography>
      </Box> */}
      {/* <Card className="mb-4 py-4">
        <Box>{info?.rows[0].message || 'xxxx'}</Box>
      </Card>
      <Card className="mb-4">
        <Floor floor={1} set_reply={set_reply}>
          <p>xxxx</p>
        </Floor>
      </Card> */}
      <Pagination
        count={10}
        page={Number(searchParams.get('page')) || 1}
        onChange={(e, value) => {
          setSearchParams(`page=${value}`)
          window.location.reload()
        }}
      />
      {info?.rows.map((item, index) => {
        return (
          <Card className="mb-4" key={item.position}>
            <>
              <section id={item.position.toString()}>
                <Floor item={item} set_reply={set_reply}>
                  <>
                    <div className="text-sm text-slate-300 flex justify-between">
                      <div>{dayjs(item.dateline * 1000).format()}</div>
                      <div className="flex flex-row gap-3 justify-between">
                        <div
                          className="hover:text-blue-500"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              window.location.href.split('#')[0] +
                                '#' +
                                item.position
                            )
                          }}
                        >
                          分享
                        </div>
                        <div>#{item.position}</div>
                      </div>
                    </div>
                    <ParsePost
                      message={item.message}
                      isMd={item.is_markdown}
                    ></ParsePost>
                  </>
                </Floor>
              </section>
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
