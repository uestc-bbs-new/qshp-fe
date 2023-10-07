import Vditor from 'vditor'

import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useSearchParams } from 'react-router-dom'

import { Box, Button, Pagination, Stack } from '@mui/material'

import { getThreadsInfo, replyThreads } from '@/apis/thread'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Editor from '@/components/Editor'
import { chineseTime } from '@/utils/dayjs'

import Floor from './Floor'
import { ParsePost } from './ParserPost'

function Thread() {
  const [vd, setVd] = useState<Vditor>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, set_page] = useState(Number(searchParams.get('page') || 1))
  const location = useLocation()
  const [thread_id, setTread_id] = useState(
    location.pathname.split('/').pop() as string
  )

  const [query, setQuery] = useState({
    thread_id: thread_id,
    page: 1,
  })

  const {
    data: info,
    isLoading: infoLoading,
    refetch,
  } = useQuery([query], () => {
    return getThreadsInfo(thread_id, page)
  })

  const handleSubmit = async () => {
    if (vd?.getValue()) {
      await replyThreads(
        Number(thread_id),
        vd?.getValue(),
        reply_floor.current.post_id === -1
          ? undefined
          : reply_floor.current.post_id
      )
      vd?.setValue('')
    }
  }

  useEffect(() => {
    if ((location.pathname.split('/').pop() as string) !== thread_id) {
      setTread_id(location.pathname.split('/').pop() as string)
      set_page(1)
      setQuery({
        ...query,
        page: 1,
        thread_id: thread_id,
      })
    } else {
      setQuery({
        ...query,
        page: page,
      })
    }
    refetch()
  }, [location])

  const reply_floor = useRef({
    floor: 1,
    post_id: -1,
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
      <Pagination
        count={info?.total ? Math.ceil(info?.total / 20) : 10}
        page={Number(searchParams.get('page')) || 1}
        onChange={(e, value) => {
          setSearchParams(`page=${value}`)
          set_page(value)
        }}
      />
      {info?.rows ? (
        info?.rows.map((item, index) => {
          return (
            <Card className="mb-4" key={item.position}>
              <>
                <section id={item.position.toString()}>
                  <Floor item={item} set_reply={set_reply}>
                    <>
                      <strong>{item.subject}</strong>
                      <div className="text-sm text-slate-300 flex justify-between">
                        <div>{chineseTime(item.dateline * 1000)}</div>
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
        })
      ) : infoLoading ? (
        <>请求帖子详细信息中</>
      ) : (
        <>帖子详细信息获取错误</>
      )}

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
