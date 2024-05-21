import { RefObject, useRef, useState } from 'react'

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'

import { PostThreadPollDetails } from '@/apis/thread'

import { PostOptionsBlock } from './PostOptionsBase'
import { PostEditorValue } from './types'

export const VoteSelection = ({
  valueRef,
}: {
  valueRef?: RefObject<PostEditorValue>
}) => {
  const initialPollDetails = valueRef?.current?.poll
  const [isVote, setVote] = useState(!!initialPollDetails)
  const savedPollDetails = useRef<PostThreadPollDetails>()
  const [options, setOptions] = useState<string[]>(['', '', ''])
  const [multiple, setMultiple] = useState(
    initialPollDetails && initialPollDetails.max_choices > 1
  )
  const [maxChoices, setMaxChoices] = useState(
    initialPollDetails?.max_choices || 2
  )
  const maxChoicesError =
    multiple && maxChoices <= 1
      ? '多选投票允许选择的数目至少为 2'
      : maxChoices > options.length
        ? '允许选择的数目超过了选项数目'
        : undefined

  const narrowView = useMediaQuery('(max-width: 750px)')
  return (
    <Box>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={isVote}
              onChange={(e) => {
                setVote(e.target.checked)
                if (valueRef?.current) {
                  if (e.target.checked) {
                    valueRef.current.poll = savedPollDetails.current || {
                      max_choices: 1,
                      visible: true,
                      show_voters: false,
                      expiration: 0,
                      is_image: false,
                      options: [],
                    }
                  } else {
                    savedPollDetails.current = valueRef?.current?.poll
                    valueRef.current.poll = undefined
                  }
                }
              }}
              color="primary"
            />
          }
          label="投票"
        />
      </FormGroup>

      {isVote && (
        <PostOptionsBlock>
          <Stack direction={narrowView ? 'column' : 'row'}>
            <Stack mr={4}>
              <Typography mt={1} mb={3}>
                选项：最多可以填写 100 个选项
              </Typography>
              {options.map((item, index) => {
                return (
                  <TextField
                    key={index}
                    label={`选项 ${index + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1.25, width: '20em' }}
                    onBlur={(e) => {
                      const newOptions = [...options]
                      newOptions[index] = e.target.value.trim()
                      setOptions(newOptions)
                      if (valueRef?.current?.poll) {
                        valueRef.current.poll.options = newOptions
                          .filter((item) => !!item)
                          .map((item) => ({
                            text: item,
                          }))
                      }
                    }}
                  />
                )
              })}
              <Button
                onClick={() => {
                  setOptions([...options, ''])
                }}
              >
                +
              </Button>
            </Stack>
            <Stack>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={valueRef?.current?.poll?.show_voters}
                      onChange={(e) => {
                        if (valueRef?.current?.poll) {
                          valueRef.current.poll.show_voters = e.target.checked
                        }
                      }}
                    />
                  }
                  label="公开投票参与人"
                />
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={valueRef?.current?.poll?.visible == false}
                      onChange={(e) => {
                        if (valueRef?.current?.poll) {
                          valueRef.current.poll.visible = !e.target.checked
                        }
                      }}
                    />
                  }
                  label="投票后结果可见"
                />
              </FormGroup>
              <TextField
                label={`计票天数`}
                variant="outlined"
                type="number"
                size="small"
                sx={{ width: '6em', mt: 1.75, mb: 1 }}
                defaultValue={initialPollDetails?.expiration || ''} // TODO: Calculate days when editing threads.
                onChange={(e) => {
                  if (valueRef?.current?.poll) {
                    valueRef.current.poll.expiration =
                      (parseInt(e.target.value) || 0) * 60 * 60 * 24
                  }
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={multiple}
                    onChange={(e) => {
                      setMultiple(e.target.checked)
                      if (valueRef?.current?.poll) {
                        valueRef.current.poll.max_choices = e.target.checked
                          ? maxChoices
                          : 1
                      }
                    }}
                  />
                }
                label="多选投票"
              />
              {multiple && (
                <TextField
                  label={`可选数目`}
                  variant="outlined"
                  size="small"
                  className="mt-4"
                  sx={{ width: '6em', mt: 1.75 }}
                  type="number"
                  error={!!maxChoicesError}
                  helperText={maxChoicesError}
                  value={maxChoices}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 1
                    setMaxChoices(newValue)
                    if (valueRef?.current?.poll) {
                      valueRef.current.poll.max_choices = newValue
                    }
                  }}
                />
              )}
            </Stack>
          </Stack>
        </PostOptionsBlock>
      )}
    </Box>
  )
}
