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

import { ForumDetails } from '@/common/interfaces/forum'
import { pages } from '@/utils/routes'
import { handleCtrlEnter } from '@/utils/tools'

import { ForumSelect } from './ForumSelect'
import { PostEditorKind, PostEditorValue } from './types'

export const ThreadPostHeader = ({
  kind,
  selectedForum,
  initialValue,
  valueRef,
  onSubmit,
}: {
  kind: PostEditorKind
  selectedForum?: ForumDetails
  initialValue?: PostEditorValue
  valueRef?: RefObject<PostEditorValue>
  onSubmit?: () => void
}) => {
  const navigate = useNavigate()

  const threadTypes = selectedForum?.thread_types || []
  const [openForumSelect, setOpenForumSelect] = useState(false)
  const [subject, setSubject] = useState(initialValue?.subject || '')
  const [typeId, setTypeId] = useState(initialValue?.type_id)

  const renderForumSelect = kind == 'newthread'
  const renderSubject = kind != 'reply' && (kind != 'edit' || subject)
  const renderThreadType =
    kind == 'newthread' || (kind == 'edit' && initialValue?.editingThread)

  if (!renderForumSelect && !renderSubject && !renderThreadType) {
    return <></>
  }

  return (
    <>
      <Stack direction="row" pb={1.5}>
        {renderForumSelect && (
          <TextField
            value={selectedForum?.name || '请选择版块'}
            sx={{ minWidth: '12em', mr: 1 }}
            onClick={() => setOpenForumSelect(true)}
          />
        )}
        {renderThreadType && (
          <>
            {threadTypes.length > 0 && (
              <FormControl sx={{ minWidth: `12em`, mr: 1 }}>
                <InputLabel id="post-typeid-label">请选择分类</InputLabel>
                <Select
                  value={typeId ?? ''}
                  label="请选择分类"
                  labelId="post-typeid-label"
                  onChange={(e) => {
                    let typeId: number | undefined = parseInt(
                      e.target.value.toString() || ''
                    )
                    if (isNaN(typeId)) {
                      typeId = undefined
                    }
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
          </>
        )}
        {renderSubject && (
          <TextField
            fullWidth
            label="标题"
            value={subject}
            onChange={(e) => {
              const subject = e.target.value
              setSubject(subject)
              valueRef?.current && (valueRef.current.subject = subject)
            }}
            onKeyDown={handleCtrlEnter(onSubmit)}
          />
        )}
      </Stack>
      {renderForumSelect && (
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
      )}
    </>
  )
}
