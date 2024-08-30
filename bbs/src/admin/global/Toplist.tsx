import { useQuery } from '@tanstack/react-query'

import React, { useState } from 'react'

import {
  AddCircle,
  ArrowCircleDown,
  Close,
  KeyboardDoubleArrowDown,
  RemoveCircle,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  HotlistCandidate,
  HotlistConfig,
  HotlistOverride,
  HotlistWeights,
  fetchHotlist,
  getHotlistConfig,
  setHotlistConfig,
} from '@/apis/admin/toplist'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import { globalCache, useForumList } from '@/states'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

const WeightEntry = ({
  text,
  value,
  parentValue,
}: {
  text: string
  value?: number
  parentValue?: number
}) => {
  if (value == undefined && parentValue != undefined) {
    return <></>
  }
  const bold = parentValue == undefined ? !!value : value != undefined
  const fontWeight = bold ? 'bold' : undefined
  const gray = value == undefined && parent != undefined
  return (
    <Stack alignItems="center">
      <Typography fontWeight={fontWeight}>{text}</Typography>
      <Typography
        fontWeight={fontWeight}
        color={gray ? 'lightgray' : undefined}
      >
        {value ?? parentValue}
      </Typography>
    </Stack>
  )
}
const WeightView = ({
  weight,
  parent,
}: {
  weight: HotlistWeights
  parent?: HotlistWeights
}) => (
  <Stack direction="row" spacing={1} flexWrap="wrap">
    <WeightEntry
      text="总权重"
      value={weight.overall}
      parentValue={parent?.overall ?? 1}
    />
    <WeightEntry text="点赞" value={weight.likes} parentValue={parent?.likes} />
    <WeightEntry
      text="点踩"
      value={weight.dislikes}
      parentValue={parent?.dislikes}
    />
    <WeightEntry
      text="回复"
      value={weight.replies}
      parentValue={parent?.replies}
    />
    <WeightEntry
      text="点评"
      value={weight.comments}
      parentValue={parent?.comments}
    />
    <WeightEntry
      text="收藏"
      value={weight.favorites}
      parentValue={parent?.favorites}
    />
    <WeightEntry
      text="回复作者"
      value={weight.reply_authors}
      parentValue={parent?.reply_authors}
    />
    <WeightEntry
      text="点评作者"
      value={weight.comment_authors}
      parentValue={parent?.comment_authors}
    />
    <WeightEntry
      text="正面评分次数"
      value={weight.positive_rates}
      parentValue={parent?.positive_rates}
    />
    <WeightEntry
      text="正面评分总数"
      value={weight.positive_scores}
      parentValue={parent?.positive_scores}
    />
    <WeightEntry
      text="负面评分次数"
      value={weight.negative_rates}
      parentValue={parent?.negative_rates}
    />
    <WeightEntry
      text="负面评分总数"
      value={weight.negative_scores}
      parentValue={parent?.negative_scores}
    />
    <WeightEntry
      text="发表时间"
      value={weight.thread_post_age}
      parentValue={parent?.thread_post_age}
    />
    <WeightEntry
      text="回复时间"
      value={weight.last_reply_age}
      parentValue={parent?.last_reply_age}
    />
  </Stack>
)

const ForumEntry = ({
  fid,
  editing,
  onRemove,
}: {
  fid: number
  editing?: boolean
  onRemove?: () => void
}) => (
  <Stack direction="row" alignItems="flex-end" flexShrink={0}>
    <Link to={pages.forum(fid)} target="_blank">
      {globalCache.fidNameMap[fid]}
    </Link>
    {editing && (
      <IconButton onClick={onRemove}>
        <RemoveCircle />
      </IconButton>
    )}
  </Stack>
)

function dictMap<K extends string | number | symbol, V, R>(
  dict: { [k in K]: V },
  callback: (k: K, v: V) => R
) {
  const result = []
  for (const k in dict) {
    result.push(callback(k, dict[k]))
  }
  return result
}

const None = () => <Typography>（暂无）</Typography>

const OverrideSection = ({
  kind,
  config,
  setConfig,
}: {
  kind: 'uid' | 'tid'
  config: HotlistConfig
  setConfig: React.Dispatch<React.SetStateAction<HotlistConfig | undefined>>
}) => {
  const key = kind == 'uid' ? 'uid_overrides2' : 'tid_overrides2'
  const value = config[key]
  const title = `特殊${kind == 'uid' ? '用户' : '帖子'}`
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<number>()
  const [newId, setNewId] = useState('')
  const [newValue, setNewValue] = useState<HotlistOverride>()
  const [blocked, setBlocked] = useState(false)
  return (
    <>
      <Typography variant="h6">
        {title}
        <IconButton
          onClick={() => {
            setActiveId(undefined)
            setNewId('')
            setNewValue(undefined)
            setBlocked(false)
            setOpen(true)
          }}
        >
          <AddCircle />
        </IconButton>
      </Typography>
      {value ? (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {dictMap(value, (id, item) => (
            <Stack
              key={id}
              alignItems="center"
              onClick={() => {
                setActiveId(id)
                setNewId(id.toString())
                setNewValue({ ...item })
                setBlocked(item?.rank == -1)
                setOpen(true)
              }}
            >
              <Typography>{id}</Typography>
              {item?.rank && (
                <Typography>
                  {item?.rank == -1 ? '屏蔽' : `下沉 ${item?.rank} 名`}
                </Typography>
              )}
              {item?.score_coefficient && (
                <Typography>系数：{item.score_coefficient}</Typography>
              )}
              {item?.score_delta && (
                <Typography>增量：{item.score_delta}</Typography>
              )}
            </Stack>
          ))}
        </Stack>
      ) : (
        <None />
      )}
      {open && (
        <Dialog open onClose={() => setOpen(false)}>
          <DialogTitle>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {activeId ? '编辑' : '添加'}
              {title}
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} py={1} alignItems="flex-start">
              <TextField
                label={title}
                value={newId}
                onChange={(e) => {
                  const value = e.target.value
                  if (!value.trim()) {
                    setNewId('')
                  } else if (!isNaN(parseInt(value))) {
                    setNewId(parseInt(value).toString())
                  }
                }}
              />
              <TextField
                label="下沉排名"
                value={newValue?.rank}
                disabled={blocked}
                onChange={(e) => {
                  const value = e.target.value.trim()
                  if (!value || value == '-') {
                    const v = { ...newValue }
                    delete v['rank']
                    setNewValue(v)
                    return
                  }
                  const intValue = parseInt(value)
                  if (!isNaN(intValue)) {
                    setNewValue({ ...newValue, rank: intValue })
                    setBlocked(intValue == -1)
                  }
                }}
              />
              <TextField
                label="系数"
                value={newValue?.score_coefficient}
                disabled={blocked}
                onChange={(e) => {
                  const value = e.target.value.trim()
                  if (!value) {
                    const v = { ...newValue }
                    delete v['score_coefficient']
                    setNewValue(v)
                    return
                  }
                  const intValue = parseFloat(value)
                  if (!isNaN(intValue)) {
                    setNewValue({ ...newValue, score_coefficient: intValue })
                  }
                }}
              />
              <TextField
                label="增量"
                value={newValue?.score_delta}
                disabled={blocked}
                onChange={(e) => {
                  const value = e.target.value.trim()
                  if (!value) {
                    const v = { ...newValue }
                    delete v['score_delta']
                    setNewValue(v)
                    return
                  }
                  const intValue = parseFloat(value)
                  if (!isNaN(intValue)) {
                    setNewValue({ ...newValue, score_delta: intValue })
                  }
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={blocked}
                    onChange={(e) => {
                      setBlocked(e.target.checked)
                    }}
                  />
                }
                label="屏蔽"
              />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const id = parseInt(newId)
                    if (isNaN(id)) {
                      return
                    }
                    const newOverrides: { [id in number]?: HotlistOverride } = {
                      ...value,
                      [id]: { ...newValue, ...(blocked && { rank: -1 }) },
                    }
                    if (activeId) {
                      if (activeId != id) {
                        delete newOverrides[activeId]
                      }
                    }
                    setConfig({
                      ...config,
                      [key]: newOverrides,
                    })
                    setOpen(false)
                  }}
                >
                  确定
                </Button>
                {activeId && (
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => {
                      let newOverrides:
                        | { [id in number]?: HotlistOverride }
                        | undefined = {
                        ...value,
                      }
                      delete newOverrides[activeId]
                      if (!Object.keys(newOverrides).length) {
                        newOverrides = undefined
                      }
                      setConfig({
                        ...config,
                        [key]: newOverrides,
                      })
                      setOpen(false)
                    }}
                  >
                    删除
                  </Button>
                )}
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

const pad = (value: number | string) => value.toString().padStart(2, '0')

const toDatetimeLocal = (value: Date) =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate()
  )}T${pad(value.getHours())}:${pad(value.getMinutes())}`

const Toplist = () => {
  const [config, setConfig] = useState<HotlistConfig>()
  const { isLoading, refetch } = useQuery({
    queryKey: ['admin', 'toplist/hotlist/config'],
    queryFn: async () => {
      const result = await getHotlistConfig()
      setConfig(result)
      return result
    },
    staleTime: Infinity,
  })
  const [savePending, setSavePending] = useState(false)
  const [fetchPending, setFetchPending] = useState(false)
  const [anchorTimestamp, setAnchorTimestamp] = useState(0)
  const [list, setList] = useState<HotlistCandidate[]>()
  useForumList()

  if (isLoading) {
    return (
      <Stack alignItems="center" my={3}>
        <CircularProgress />
      </Stack>
    )
  }
  return (
    <>
      <Typography variant="h4">热门管理</Typography>
      {config && (
        <>
          <Typography variant="h6">排除版块：</Typography>
          {config.excluded_fids ? (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {config.excluded_fids.sort().map((fid) => (
                <ForumEntry key={fid} fid={fid} />
              ))}
            </Stack>
          ) : (
            <None />
          )}
          <Typography variant="h6">默认权重：</Typography>
          <WeightView weight={config.weights} />
          <Typography variant="h6">版块权重：</Typography>
          {config.fid_overrides ? (
            <>
              {config.fid_overrides?.map((item, index) => (
                <Box key={index}>
                  {item.fids.map((fid) => (
                    <ForumEntry key={fid} fid={fid} />
                  ))}
                  <WeightView weight={item} parent={config.weights} />
                </Box>
              ))}
            </>
          ) : (
            <None />
          )}
          <Typography variant="h6">前十版块限制：</Typography>
          {config.fid_top_limits ? (
            <>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {dictMap(config.fid_top_limits, (fid, limit) => (
                  <Stack key={fid} alignItems="center">
                    <ForumEntry fid={fid} />
                    <Typography>{limit}</Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          ) : (
            <None />
          )}
          <OverrideSection kind="uid" config={config} setConfig={setConfig} />
          <OverrideSection kind="tid" config={config} setConfig={setConfig} />
          <Button
            color="success"
            variant="contained"
            disabled={savePending}
            onClick={async () => {
              try {
                setSavePending(true)
                await setHotlistConfig(config)
                await refetch()
              } finally {
                setSavePending(false)
              }
            }}
          >
            保存
          </Button>
          <Stack direction="row" alignItems="center" mt={2}>
            <Button
              color="info"
              variant="contained"
              disabled={fetchPending}
              onClick={async () => {
                try {
                  setFetchPending(true)
                  setList(
                    await fetchHotlist({
                      config,
                      anchor_timestamp: anchorTimestamp,
                    })
                  )
                } finally {
                  setFetchPending(false)
                }
              }}
            >
              获取数据
            </Button>
            <Typography ml={2} mr={1}>
              基准时间
            </Typography>
            <TextField
              type="datetime-local"
              size="small"
              value={
                anchorTimestamp
                  ? toDatetimeLocal(new Date(anchorTimestamp * 1000))
                  : ''
              }
              onChange={(e) => {
                if (e.target.value) {
                  setAnchorTimestamp(
                    Math.floor(new Date(e.target.value).getTime() / 1000)
                  )
                } else {
                  setAnchorTimestamp(0)
                }
              }}
            />
          </Stack>
          {list && (
            <table>
              <thead>
                <tr>
                  <th>排名</th>
                  <th>标题</th>
                  <th>分值</th>
                  <th>发表时间</th>
                  <th>最后回复</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, index) => (
                  <tr key={item.thread_id}>
                    <td>
                      <Typography>{index + 1}</Typography>
                      {item.descend_by_excess && <KeyboardDoubleArrowDown />}
                      {item.descend_by_override && <ArrowCircleDown />}
                    </td>
                    <td>
                      <Stack>
                        <Link
                          to={pages.thread(item.thread_id)}
                          variant="h6"
                          target="_blank"
                        >
                          {item.subject}
                        </Link>
                        <Stack direction="row" alignItems="flex-end">
                          <Link to={pages.forum(item.forum_id)} target="_blank">
                            {globalCache.fidNameMap[item.forum_id]}
                          </Link>
                          <Avatar
                            uid={item.author_id}
                            size={28}
                            sx={{ ml: 2, mr: 1 }}
                          />
                          <Link
                            to={pages.user({ uid: item.author_id })}
                            target="_blank"
                          >
                            {item.author}
                          </Link>
                        </Stack>
                      </Stack>
                    </td>
                    <td>
                      <ScoreView item={item} />
                    </td>
                    <td>{chineseTime(item.dateline * 1000)}</td>
                    <td>{chineseTime(item.last_post * 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </>
      )}
    </>
  )
}

const ScoreView = ({ item }: { item: HotlistCandidate }) => (
  <Stack alignItems="center">
    <Stack direction="row" alignItems="center">
      <Typography variant="h6">{item.score.toFixed(1)}</Typography>
      {item.score != item.raw_score && (
        <Typography variant="body2" ml={1}>
          ({item.raw_score.toFixed(1)})
        </Typography>
      )}
    </Stack>
    <div
      css={{
        display: 'grid',
        gridTemplate: 'auto auto / repeat(2, 1fr)',
        gridAutoFlow: 'column',
        justifyItems: 'center',
        alignItems: 'end',
        gap: '3px 5px',
      }}
    >
      <Typography variant="body2">赞</Typography>
      <Typography variant="body2">{item.recommend_add}</Typography>
      <Typography variant="body2">踩</Typography>
      <Typography variant="body2">{item.recommend_sub}</Typography>
      <Typography variant="body2">
        回复
        <br />
        作者
      </Typography>
      <Typography variant="body2">{item.reply_authors}</Typography>
      <Typography variant="body2">
        点评
        <br />
        作者
      </Typography>
      <Typography variant="body2">{item.comment_authors}</Typography>
      <Typography variant="body2">
        正面
        <br />
        评分
      </Typography>
      <Typography variant="body2">{item.positive_scores}</Typography>
      <Typography variant="body2">
        负面
        <br />
        评分
      </Typography>
      <Typography variant="body2">{item.negative_scores}</Typography>
    </div>
  </Stack>
)

export default Toplist
