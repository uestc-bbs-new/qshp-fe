import { RefObject, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'

import { PostThreadDetails } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/response'
import { pages } from '@/utils/routes'

import { ForumSelect } from './ForumSelect'

export const ThreadPostHeader = ({
  selectedForum,
  initialValue,
  valueRef,
}: {
  selectedForum?: ForumDetails
  initialValue?: PostThreadDetails
  valueRef?: RefObject<Partial<PostThreadDetails>>
}) => {
  const navigate = useNavigate()

  const threadTypes = selectedForum?.thread_types || []
  const [openForumSelect, setOpenForumSelect] = useState(false)
  const [subject, setSubject] = useState(initialValue?.subject || '')
  const [typeId, setTypeId] = useState(initialValue?.type_id)

  if (initialValue && valueRef?.current) {
    Object.assign(valueRef.current, initialValue)
  }

  return (
    <>
      <Stack direction="row" className="pb-4">
        <TextField
          value={selectedForum?.name || '请选择版块'}
          sx={{ minWidth: '12em' }}
          onClick={() => setOpenForumSelect(true)}
        />
        {threadTypes.length > 0 && (
          <FormControl sx={{ minWidth: `12em` }}>
            <InputLabel id="post-typeid-label">请选择分类</InputLabel>
            <Select
              value={typeId}
              label="请选择分类"
              labelId="post-typeid-label"
              onChange={(e) => {
                const typeId = e.target.value
                setTypeId(typeId)
                valueRef?.current && (valueRef.current.type_id = typeId)
              }}
            >
              {selectedForum?.thread_types.map((item) => (
                <MenuItem key={item.name} value={item.type_id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          fullWidth
          label="标题"
          value={subject}
          onChange={(e) => {
            const subject = e.target.value
            setSubject(subject)
            valueRef?.current && (valueRef.current.subject = subject)
          }}
        />
      </Stack>
      <ForumSelect
        open={openForumSelect}
        selectedFid={selectedForum?.fid}
        onCompleted={(fid: number | undefined) => {
          if (fid != selectedForum?.fid) {
            navigate(pages.post(fid))
          }
          setOpenForumSelect(false)
        }}
      />
    </>
  )
}
