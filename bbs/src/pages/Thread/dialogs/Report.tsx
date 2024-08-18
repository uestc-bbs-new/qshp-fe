import { useRef } from 'react'

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'

import { reportPost } from '@/apis/thread'
import { PostFloor } from '@/common/interfaces/response'
import GeneralDialog from '@/components/GeneralDialog'
import { useAppState } from '@/states'

const kOtherReason = '其他'
const kReasons = ['广告垃圾', '违规内容', '恶意灌水', '重复发帖', kOtherReason]

export const ReportDialog = ({
  open,
  onClose,
  post,
}: {
  open: boolean
  onClose?: () => void
  post: PostFloor
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { dispatch } = useAppState()
  return (
    <GeneralDialog
      open={open}
      onClose={onClose}
      titleText="举报"
      actions={[
        {
          type: 'ok',
          onClick: async () => {
            if (!formRef.current) {
              return
            }
            const data = new FormData(formRef.current)
            const reason = data.get('reason') ?? ''
            let message = data.get('message')?.toString() ?? ''
            if (reason && reason != kOtherReason) {
              message = `[${reason}]${message.trim()}`
            }
            if (!message) {
              dispatch({
                type: 'open snackbar',
                payload: {
                  severity: 'error',
                  message: '请选择或填写举报理由。',
                },
              })
              throw false
            }
            await reportPost(post.post_id, post.forum_id, message)
          },
        },
      ]}
    >
      <form ref={formRef}>
        <Stack mb={1}>
          <FormControl>
            <FormLabel>举报理由</FormLabel>
            <RadioGroup name="reason">
              {kReasons.map((text) => (
                <FormControlLabel
                  key={text}
                  value={text}
                  control={<Radio />}
                  label={text}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>举报说明</FormLabel>
            <TextField
              multiline
              name="message"
              rows={5}
              sx={{ width: '25em', maxWidth: '100%' }}
            />
          </FormControl>
        </Stack>
      </form>
    </GeneralDialog>
  )
}
