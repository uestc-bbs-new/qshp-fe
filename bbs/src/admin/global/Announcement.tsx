import { useEffect, useRef, useState } from 'react'

import { Box, Button, List, ListItem, Stack, TextField } from '@mui/material'

import { getAnnouncement, setAnnouncement } from '@/apis/admin/global'
import {
  Announcement as AnnouncementItem,
  kAnnouncementSimple,
} from '@/common/interfaces/response'
import { AnnouncementBody, AnnouncementBox } from '@/components/Announcement'

const Announcement = () => {
  const [data, setData] = useState<AnnouncementItem[]>()
  useEffect(() => {
    ;(async () => {
      setData(await getAnnouncement())
    })()
  }, [])

  const titleRef = useRef<HTMLInputElement>()
  const summaryRef = useRef<HTMLInputElement>()
  const hrefRef = useRef<HTMLInputElement>()
  const startTimeRef = useRef<HTMLInputElement>()
  const endTimeRef = useRef<HTMLInputElement>()
  const highlightColorRef = useRef<HTMLInputElement>(null)
  const darkHighlightColorRef = useRef<HTMLInputElement>(null)

  const [pending, setPending] = useState(false)

  const handleAdd = () => {
    if (!data || !titleRef.current?.value || !hrefRef.current?.value) {
      return
    }
    setData([
      {
        kind: kAnnouncementSimple,
        title: titleRef.current.value,
        href: hrefRef.current.value,
      },
      ...data,
    ])
  }
  const handleDelete = (item: AnnouncementItem) => {
    setData(data?.filter((cur) => cur != item))
  }

  const handleSave = () => {
    if (!data) {
      return
    }
    setPending(true)
    setAnnouncement(data).finally(() => setPending(false))
  }

  return (
    <Box>
      <Stack>
        <TextField label="标题" inputRef={titleRef} />
        <TextField label="摘要" inputRef={summaryRef} />
        <TextField label="链接" inputRef={hrefRef} />
        <TextField
          type="datetime-local"
          label="开始时间"
          InputLabelProps={{ shrink: true }}
          inputRef={startTimeRef}
        />
        <TextField
          type="datetime-local"
          label="结束时间"
          InputLabelProps={{ shrink: true }}
          inputRef={endTimeRef}
        />
        <input type="color" ref={highlightColorRef} />
        <input type="color" ref={darkHighlightColorRef} />
      </Stack>
      <Button onClick={handleAdd}>添加</Button>
      <Button disabled={!data || pending} onClick={handleSave}>
        保存
      </Button>
      <List>
        {data?.map((item, index) => (
          <ListItem key={index}>
            <AnnouncementBox m={1} width="100%">
              <Stack direction="row">
                <AnnouncementBody
                  item={item}
                  sx={{ flexGrow: 1, flexShrink: 1 }}
                />
                <Stack flexGrow={0} flexShrink={0}>
                  <Button>编辑</Button>
                  <Button onClick={() => handleDelete(item)}>删除</Button>
                </Stack>
              </Stack>
            </AnnouncementBox>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
export default Announcement
