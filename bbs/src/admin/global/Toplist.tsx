import { useQuery } from '@tanstack/react-query'

import React, { useState } from 'react'

import { AddCircle, Close, RemoveCircle } from '@mui/icons-material'
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
  HotlistConfig,
  HotlistWeights,
  getHotlistConfig,
  setHotlistConfig,
} from '@/apis/admin/toplist'
import Link from '@/components/Link'
import { globalCache, useForumList } from '@/states'
import { pages } from '@/utils/routes'

const WeightEntry = ({ text, value }: { text: string; value?: number }) => (
  <Stack alignItems="center">
    <Typography>{text}</Typography>
    <Typography>{value}</Typography>
  </Stack>
)

const WeightView = ({ weight }: { weight: HotlistWeights }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap">
    <WeightEntry text="总权重" value={weight.overall ?? 1} />
    <WeightEntry text="点赞" value={weight.likes} />
    <WeightEntry text="点踩" value={weight.dislikes} />
    <WeightEntry text="回复" value={weight.replies} />
    <WeightEntry text="点评" value={weight.comments} />
    <WeightEntry text="收藏" value={weight.favorites} />
    <WeightEntry text="回复作者" value={weight.reply_authors} />
    <WeightEntry text="点评作者" value={weight.comment_authors} />
    <WeightEntry text="正面评分次数" value={weight.positive_rates} />
    <WeightEntry text="正面评分总数" value={weight.positive_scores} />
    <WeightEntry text="负面评分次数" value={weight.negative_rates} />
    <WeightEntry text="负面评分总数" value={weight.negative_scores} />
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
    <Link to={pages.forum(fid)}>{globalCache.fidNameMap[fid]}</Link>
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
  const key = kind == 'uid' ? 'uid_overrides' : 'tid_overrides'
  const value = config[key]
  const title = `特殊${kind == 'uid' ? '用户' : '帖子'}`
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<number>()
  const [newId, setNewId] = useState('')
  const [newRank, setNewRank] = useState('')
  const [blocked, setBlocked] = useState(false)
  return (
    <>
      <Typography variant="h6">
        {title}
        <IconButton
          onClick={() => {
            setActiveId(undefined)
            setNewId('')
            setNewRank('')
            setBlocked(false)
            setOpen(true)
          }}
        >
          <AddCircle />
        </IconButton>
      </Typography>
      {value ? (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {dictMap(value, (id, rank) => (
            <Stack
              key={id}
              alignItems="center"
              onClick={() => {
                setActiveId(id)
                setNewId(id.toString())
                setNewRank(rank?.toString() ?? '')
                setBlocked(rank == -1)
                setOpen(true)
              }}
            >
              <Typography>{id}</Typography>
              <Typography>{rank == -1 ? '屏蔽' : `下沉 ${rank} 名`}</Typography>
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
                value={newRank}
                disabled={blocked}
                onChange={(e) => {
                  const value = e.target.value.trim()
                  if (!value || value == '-') {
                    setNewRank(value)
                    return
                  }
                  const intValue = parseInt(value)
                  if (!isNaN(intValue)) {
                    setNewRank(intValue.toString())
                    setBlocked(intValue == -1)
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
                    const rank = blocked ? -1 : parseInt(newRank)
                    if (isNaN(id) || isNaN(rank)) {
                      return
                    }
                    const newOverrides: { [id in number]?: number } = {
                      ...value,
                      [id]: rank,
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
                        | { [id in number]?: number }
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
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </>
      )}
    </>
  )
}

export default Toplist
