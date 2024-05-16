import { useEffect, useRef, useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Stack,
  TextField,
} from '@mui/material'

import { getAnnouncement, setAnnouncement } from '@/apis/admin/global'
import {
  Announcement as AnnouncementItem,
  kAnnouncementSimple,
} from '@/common/interfaces/response'
import { AnnouncementBody, AnnouncementBox } from '@/components/Announcement'

const EditDialog = ({
  open,
  onClose,
  item,
}: {
  item?: AnnouncementItem
  open: boolean
  onClose: (item?: AnnouncementItem) => void
}) => {
  const titleRef = useRef<HTMLInputElement>()
  const summaryRef = useRef<HTMLInputElement>()
  const hrefRef = useRef<HTMLInputElement>()
  const startTimeRef = useRef<HTMLInputElement>()
  const endTimeRef = useRef<HTMLInputElement>()
  const highlightColorRef = useRef<HTMLInputElement>(null)
  const darkHighlightColorRef = useRef<HTMLInputElement>(null)

  const handleOk = () => {
    if (!titleRef.current?.value || !hrefRef.current?.value) {
      return
    }
    const newItem: AnnouncementItem = {
      kind: kAnnouncementSimple,
      title: titleRef.current?.value,
      href: hrefRef.current?.value,
    }
    if (summaryRef.current?.value) {
      newItem.summary = summaryRef.current.value
    }
    if (startTimeRef.current?.value) {
      newItem.start_time = new Date(startTimeRef.current.value).getTime()
    }
    if (endTimeRef.current?.value) {
      newItem.end_time = new Date(endTimeRef.current.value).getTime()
    }
    if (
      highlightColorRef.current?.value &&
      highlightColorRef.current?.value != '#000000'
    ) {
      newItem.highlight_color = highlightColorRef.current.value
    }
    if (
      darkHighlightColorRef.current?.value &&
      darkHighlightColorRef.current?.value != '#000000'
    ) {
      newItem.dark_highlight_color = darkHighlightColorRef.current.value
    }
    onClose(newItem)
  }

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>编辑公告</DialogTitle>
      <DialogContent>
        <TextField
          label="标题"
          fullWidth
          sx={{ my: 1 }}
          defaultValue={item?.title}
          inputRef={titleRef}
        />
        <TextField
          label="摘要"
          fullWidth
          sx={{ my: 1 }}
          defaultValue={item?.summary}
          inputRef={summaryRef}
        />
        <TextField
          label="链接"
          fullWidth
          sx={{ my: 1 }}
          defaultValue={item?.href}
          inputRef={hrefRef}
        />
        <Stack direction="row" justifyContent="space-between" my={1}>
          <TextField
            type="datetime-local"
            label="开始时间"
            InputLabelProps={{ shrink: true }}
            defaultValue={
              item?.start_time
                ? toInputDateTimeLocal(new Date(item.start_time))
                : undefined
            }
            inputRef={startTimeRef}
            sx={{ width: '46%' }}
          />
          <TextField
            type="datetime-local"
            label="结束时间"
            InputLabelProps={{ shrink: true }}
            defaultValue={
              item?.end_time
                ? toInputDateTimeLocal(new Date(item.end_time))
                : undefined
            }
            inputRef={endTimeRef}
            sx={{ width: '46%' }}
          />
        </Stack>
        <Stack direction="row" my={2}>
          <TextField
            type="color"
            label="高亮颜色"
            InputLabelProps={{ shrink: true }}
            defaultValue={item?.highlight_color}
            inputRef={highlightColorRef}
            InputProps={{ sx: { width: '6em' } }}
            variant="standard"
            sx={{ mr: 2 }}
          />
          <TextField
            type="color"
            label="高亮颜色（暗）"
            InputLabelProps={{ shrink: true }}
            defaultValue={item?.dark_highlight_color}
            inputRef={darkHighlightColorRef}
            InputProps={{ sx: { width: '6em' } }}
            variant="standard"
          />
        </Stack>
        <Button onClick={handleOk}>确定</Button>
        <Button onClick={() => onClose()}>取消</Button>
      </DialogContent>
    </Dialog>
  )
}

const Announcement = () => {
  const [data, setData] = useState<AnnouncementItem[]>()
  useEffect(() => {
    ;(async () => {
      setData(await getAnnouncement())
    })()
  }, [])
  const [activeItem, setActiveItem] = useState<AnnouncementItem>()
  const [editOpen, setEditOpen] = useState(false)

  const [pending, setPending] = useState(false)

  const handleAdd = () => {
    setActiveItem(undefined)
    setEditOpen(true)
  }
  const handleItemSave = (newItem?: AnnouncementItem) => {
    setEditOpen(false)
    if (!newItem) {
      return
    }
    setData(
      activeItem
        ? data?.map((item) => (item == activeItem ? newItem : item))
        : [...(data || []), newItem]
    )
  }
  const handleEdit = (item: AnnouncementItem) => {
    setActiveItem(item)
    setEditOpen(true)
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
                  <Button onClick={() => handleEdit(item)}>编辑</Button>
                  <Button onClick={() => handleDelete(item)}>删除</Button>
                </Stack>
              </Stack>
            </AnnouncementBox>
          </ListItem>
        ))}
      </List>
      <EditDialog open={editOpen} onClose={handleItemSave} item={activeItem} />
    </Box>
  )
}

const padDateTime = (value: number | string) =>
  value.toString().padStart(2, '0')
const toInputDateTimeLocal = (date: Date) =>
  `${date.getFullYear()}-${padDateTime(date.getMonth() + 1)}-${padDateTime(
    date.getDate()
  )}T${padDateTime(date.getHours())}:${padDateTime(date.getMinutes())}`

export default Announcement
