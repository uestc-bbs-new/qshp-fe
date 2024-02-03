import { useState } from 'react'

import {
  Box,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
} from '@mui/material'

// todo: props 先放 any，以后再改，入参具体还不确定
export const VoteSelection = (props: any) => {
  const [typeState, setTypeState] = useState({
    isVote: false,
  })

  const [options, setOptions] = useState([
    { value: '' },
    { value: '' },
    { value: '' },
  ])

  return (
    <Stack {...props}>
      <FormGroup row>
        {/* todo: 后面如果有多个类型可以改成 for in 枚举 typeState 生成复选框 */}
        <FormControlLabel
          control={
            <Switch
              checked={typeState.isVote}
              onChange={(e) => {
                setTypeState({
                  ...typeState,
                  [e.target.name]: e.target.checked,
                })
              }}
              name="isVote"
            />
          }
          label="isVote"
        />
      </FormGroup>

      {typeState.isVote ? (
        <Stack className="w-9/12 bg-indigo-100 px-6 py-4 flex justify-between flex-row">
          <Box className="flex flex-col">
            <Box>选项：最多可以填写 100 个选项</Box>
            {options.map((item, index) => {
              return (
                <TextField
                  key={index}
                  id={index.toString()}
                  label={`选项 ${index}`}
                  variant="outlined"
                  size="small"
                  className="mt-4"
                  // 如果用 onChange， 每次输入，整个列表都需要重新 diff 或者 渲染，感觉性能开销有点大
                  // change: 如果对该场景有要求，可以切成 onChange
                  onBlur={(e) => {
                    console.log(e)
                    const newOption = [...options]
                    options[index].value = e.target.value
                    setOptions(newOption)
                  }}
                />
              )
            })}
            <Box
              className="w-full text-center h-10 border"
              onClick={() => {
                setOptions([...options, { value: '' }])
              }}
            >
              +
            </Box>
          </Box>
          <Box>
            <TextField
              label={`最多选择数`}
              variant="outlined"
              size="small"
              className="mt-4"
            />
            <TextField
              label={`计票天数`}
              variant="outlined"
              size="small"
              className="mt-4"
            />
          </Box>
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  )
}
