import { RefObject, useState } from 'react'

import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material'

import { PostThreadDetails } from '@/apis/thread'
import { ForumDetails } from '@/common/interfaces/response'

const PostOptions = ({
  forum,
  initialValue,
  valueRef,
}: {
  forum?: ForumDetails
  initialValue?: PostThreadDetails
  valueRef?: RefObject<Partial<PostThreadDetails>>
}) => {
  const [anonymous, setAnonymous] = useState(
    initialValue?.is_anonymous || false
  )
  return (
    <Box>
      {forum?.can_post_anonymously && (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymous}
                onChange={(e) => {
                  const checked = e.target.checked
                  setAnonymous(checked)
                  valueRef?.current && (valueRef.current.is_anonymous = checked)
                }}
              />
            }
            label="匿名发帖"
          />
        </FormGroup>
      )}
    </Box>
  )
}

export default PostOptions
