import { RefObject, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
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
    (kind == 'newthread' || (kind == 'edit' && initialValue?.editingThread)) &&
    threadTypes.length > 0

  if (!renderForumSelect && !renderSubject && !renderThreadType) {
    return <></>
  }

  const narrowView = useMediaQuery('(max-width: 800px)')
  const thinView = useMediaQuery('(max-width: 560px)')

  return (
    <>
      <Stack
        direction="row"
        pb={1.5}
        flexWrap={narrowView ? 'wrap' : undefined}
      >
        {renderForumSelect && (
          <TextField
            value={selectedForum?.name || '请选择版块'}
            sx={{
              flexBasis: narrowView ? '40%' : undefined,
              minWidth: narrowView ? undefined : `12em`,
              mr: !narrowView || renderThreadType ? 1 : 0,
              flexGrow: narrowView ? 1 : undefined,
            }}
            size={thinView ? 'small' : undefined}
            onClick={() => setOpenForumSelect(true)}
          />
        )}
        {renderThreadType && (
          <FormControl
            sx={{
              flexBasis: narrowView ? '40%' : undefined,
              minWidth: narrowView ? undefined : `12em`,
              mr: narrowView ? 0 : 1,
              flexGrow: narrowView ? 1 : undefined,
            }}
            size={thinView ? 'small' : undefined}
          >
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
            sx={narrowView ? { mt: thinView ? 1.5 : 1 } : undefined}
            size={thinView ? 'small' : undefined}
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
