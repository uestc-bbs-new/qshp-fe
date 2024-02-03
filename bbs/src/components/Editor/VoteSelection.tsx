import { useEffect, useState } from 'react'

import {
  Box,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
} from '@mui/material'

import {
  ThreadPollDetails,
  ThreadPollOption,
} from '@/common/interfaces/response'

type Props = {
  isVote: boolean
  changeIsVote: (status: boolean) => void
  // props 投票信息改变后主动上报给父组件
  updateVotesOption: (
    poll: Omit<
      ThreadPollDetails,
      'selected_options' | 'voter_count' | 'options'
    > & { options: Partial<Omit<ThreadPollOption, 'votes' | 'voters'>>[] }
  ) => void
  [key: string]: any
}
export const VoteSelection = ({
  isVote,
  changeIsVote,
  updateVotesOption,
  ...props
}: Props) => {
  const [options, setOptions] = useState([
    { value: '' },
    { value: '' },
    { value: '' },
  ])
  // const poll:PostThreadDetails
  // todo: 感觉 fomily 表单的思想性能更好些，但是违背了单项数据流或者写起来比较麻烦
  useEffect(() => {
    const VoteOptions: Partial<Omit<ThreadPollOption, 'votes' | 'voters'>>[] =
      []
    // useMemo 可以优化下，但是感觉没必要，投票选项不是特别多
    options.forEach((item) => {
      if (item.value) {
        VoteOptions.push({ text: item.value })
      }
    })
    // todo: 先写死，晚点改
    updateVotesOption({
      show_voters: false,
      multiple: false,
      visible: false,
      max_choices: 0,
      is_image: false,
      expiration: 5000000000,
      options: VoteOptions,
    })
  }, [options])

  return (
    // 感觉选项也应该抽离到父组件
    <Stack {...props}>
      <FormGroup row>
        {/* todo: 后面如果有多个类型可以改成 for in 枚举 typeState 生成复选框 */}
        <FormControlLabel
          control={
            <Switch
              checked={isVote}
              onChange={(e) => {
                changeIsVote(e.target.checked)
              }}
              name="isVote"
            />
          }
          label="isVote"
        />
      </FormGroup>

      {isVote ? (
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
