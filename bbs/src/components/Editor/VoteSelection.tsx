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

  const [configurations, setConfiguration] = useState<
    Omit<ThreadPollDetails, 'selected_options' | 'voter_count' | 'options'>
  >({
    show_voters: false,
    multiple: true,
    visible: true,
    max_choices: 1,
    is_image: false, // todo: 暂不支持
    expiration: 0,
  })
  console.log('vote render')

  // const poll:PostThreadDetails
  // todo: 感觉用 fomily 表单的思想去传递 options 性能更好些，但是违背了单项数据流或者写起来比较麻烦（目前写法待定）
  useEffect(() => {
    const VoteOptions: Partial<Omit<ThreadPollOption, 'votes' | 'voters'>>[] =
      []
    // useMemo 可以优化下，但是感觉没必要，投票选项一般不会特别多
    options.forEach((item, index) => {
      if (item.value) {
        VoteOptions.push({
          text: item.value,

          display_order: index,
        })
      }
    })
    // todo: 先写死，晚点改
    updateVotesOption({
      ...configurations,
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
          <Box className="flex-col">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={configurations.show_voters}
                    onChange={(e) => {
                      setConfiguration({
                        ...configurations,
                        show_voters: e.target.checked,
                      })
                    }}
                    name="show_voters"
                  />
                }
                label="公开投票参与人"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={configurations.visible}
                    onChange={(e) => {
                      setConfiguration({
                        ...configurations,
                        visible: e.target.checked,
                      })
                    }}
                    name="visible"
                  />
                }
                label="投票后结果可见"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={configurations.multiple}
                    onChange={(e) => {
                      setConfiguration({
                        ...configurations,
                        max_choices: e.target.checked ? 2 : 1,
                        multiple: e.target.checked,
                      })
                    }}
                    name="multiple"
                  />
                }
                label="多选投票"
              />
            </FormGroup>
            {configurations.multiple ? (
              <TextField
                label={`最多选择数`}
                variant="outlined"
                size="small"
                className="mt-4"
                type="number"
                onChange={(e) => {
                  if (Number(e.target.value) > 1) {
                    setConfiguration({
                      ...configurations,
                      max_choices: Number(e.target.value),
                    })
                  } else {
                    console.log('选择数不能低于 2， 否则帖子无法正常新增')
                  }
                }}
              />
            ) : (
              <></>
            )}
            {/* todo: 这里是去填一个时间？还是去使用日期选择器选中一个指定的日期时间 */}
            <TextField
              label={`计票天数`}
              variant="outlined"
              type="number"
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
