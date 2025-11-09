import { useQuery } from '@tanstack/react-query'
import { setConfig } from 'dompurify'

import React, { useEffect, useMemo, useState } from 'react'

import {
  Add,
  CheckCircle,
  Delete,
  EditNote,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
  Pending,
  RemoveCircle,
  Sort,
} from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
  debounce,
} from '@mui/material'

import { searchSummary } from '@/apis/search'
import { User } from '@/common/interfaces/base'
import {
  SearchSummaryResponse,
  SearchSummaryUser,
} from '@/common/interfaces/search'
import Avatar from '@/components/Avatar'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import {
  LuckyDrawConfig,
  LuckyDrawPrize,
  PrizeSortMethod,
  addPrize,
  deletePrize,
  getPrizes,
  updateConfig,
  updatePrize,
} from './api'

const ConfirmDialog = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose?: (result: boolean) => void
  title?: React.ReactNode
  children: React.ReactNode
}) => {
  const handleClose = (result: boolean) => {
    if (onClose) {
      onClose(result)
    }
  }
  return (
    <Dialog open={open}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <Stack direction="row" alignItems="center" px={3} pb={2}>
        <Button variant="contained" onClick={() => handleClose(true)}>
          确定
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          sx={{ ml: 1 }}
          onClick={() => handleClose(false)}
        >
          取消
        </Button>
      </Stack>
    </Dialog>
  )
}

const EditConfirm = ({
  oldItem,
  newItem,
  onClose,
}: {
  oldItem: LuckyDrawPrize
  newItem: Partial<LuckyDrawPrize>
  onClose: (result: boolean) => void
}) => {
  const delta = (newItem.total ?? 0) - oldItem.total
  return (
    <ConfirmDialog open onClose={onClose} title="请确认奖品修改：">
      <Typography>奖品名称：{oldItem.name}</Typography>
      {newItem.name != oldItem.name && (
        <Typography>更名为：{newItem.name}</Typography>
      )}
      {!!delta && (
        <Typography>
          库存变化：
          <b>
            {delta > 0 ? '+' : ''}
            {delta}
          </b>
        </Typography>
      )}
    </ConfirmDialog>
  )
}

const kPrizeClaimMap: { [k: string]: string } = {
  '1': '现场领取',
  '2': '关注后续通知公告',
}

const PrizeRow = ({
  item,
  onRefresh,
}: {
  item?: LuckyDrawPrize
  onRefresh?: () => void
}) => {
  const newItem = !item
  const [editing, setEditing] = useState(newItem)
  const [currentItem, setItem] = useState<Partial<LuckyDrawPrize>>(item || {})
  const [pending, setPending] = useState(false)
  const [editConfirm, setEditConfirm] = useState(false)
  const handleAdd = async () => {
    if (!currentItem.name || !currentItem.total) {
      return
    }
    setPending(true)
    try {
      await addPrize({
        name: currentItem.name,
        total: currentItem.total,
        remaining: currentItem.total,
        probability1: currentItem.probability1 ?? 0,
        probability2: currentItem.probability2 ?? 0,
        probability3: currentItem.probability3 ?? 0,
        claim_text: currentItem.claim_text,
      })
      onRefresh && onRefresh()
      setItem({})
    } finally {
      setPending(false)
    }
  }
  const handleDelete = async () => {
    if (!item) {
      return
    }
    setPending(true)
    try {
      await deletePrize(item.id)
      onRefresh && onRefresh()
    } finally {
      setPending(false)
    }
  }
  const handleEdit = () => {
    if (editing) {
      if (!currentItem.name || currentItem.total == undefined || !item) {
        return
      }
      if (currentItem.total != item.total) {
        setEditConfirm(true)
      } else {
        handleEditConfirm(true)
      }
    } else {
      setEditing(true)
    }
  }
  const handleEditConfirm = async (result: boolean) => {
    if (!result) {
      setEditConfirm(false)
      return
    }
    if (!currentItem.name || currentItem.total == undefined || !item) {
      return
    }
    setPending(true)
    try {
      await updatePrize(item.id, {
        name: currentItem.name,
        total_delta: currentItem.total - item.total,
        probability1: currentItem.probability1 ?? 0,
        probability2: currentItem.probability2 ?? 0,
        probability3: currentItem.probability3 ?? 0,
        claim_text: currentItem.claim_text,
      })
      onRefresh && onRefresh()
      setEditConfirm(false)
      setEditing(false)
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    setItem(item || {})
  }, [item])
  return (
    <>
      {editing ? (
        <>
          <TextField
            value={currentItem.name ?? ''}
            onChange={(e) => setItem({ ...currentItem, name: e.target.value })}
            size="small"
            disabled={pending}
          />
          <TextField
            value={currentItem.total ?? ''}
            onChange={(e) =>
              setItem({
                ...currentItem,
                total: Math.max(parseInt(e.target.value) || 0, 0),
              })
            }
            type="number"
            size="small"
            disabled={pending}
          />
        </>
      ) : (
        <>
          <Typography>{currentItem.name}</Typography>
          <Typography>{currentItem.total}</Typography>
        </>
      )}
      <Typography>{currentItem.remaining}</Typography>
      {editing ? (
        <>
          <TextField
            value={currentItem.probability1 ?? ''}
            onChange={(e) =>
              setItem({
                ...currentItem,
                probability1: Math.max(parseFloat(e.target.value) || 0, 0),
              })
            }
            type="number"
            size="small"
            disabled={pending}
          />
          <TextField
            value={currentItem.probability2 ?? ''}
            onChange={(e) =>
              setItem({
                ...currentItem,
                probability2: Math.max(parseFloat(e.target.value) || 0, 0),
              })
            }
            type="number"
            size="small"
            disabled={pending}
          />
          <TextField
            value={currentItem.probability3 ?? ''}
            onChange={(e) =>
              setItem({
                ...currentItem,
                probability3: Math.max(parseFloat(e.target.value) || 0, 0),
              })
            }
            type="number"
            size="small"
            disabled={pending}
          />
          <Select
            size="small"
            value={currentItem.claim_text ?? ''}
            onChange={(e) =>
              setItem({ ...currentItem, claim_text: e.target.value })
            }
          >
            {Object.entries(kPrizeClaimMap).map(([k, v]) => (
              <MenuItem value={k} key={k}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : (
        <>
          <Typography>{currentItem.probability1}</Typography>
          <Typography>{currentItem.probability2}</Typography>
          <Typography>{currentItem.probability3}</Typography>
          <Typography>
            {kPrizeClaimMap[currentItem.claim_text ?? ''] ?? ''}
          </Typography>
        </>
      )}
      <Stack direction="row" alignItems="center">
        {newItem ? (
          <IconButton onClick={handleAdd} disabled={pending}>
            <Add />
          </IconButton>
        ) : (
          <>
            <IconButton onClick={handleEdit} disabled={pending}>
              {editing ? <CheckCircle /> : <EditNote />}
            </IconButton>
            <IconButton onClick={handleDelete} disabled={pending}>
              <Delete />
            </IconButton>
          </>
        )}
      </Stack>
      {item && editConfirm && (
        <EditConfirm
          onClose={handleEditConfirm}
          oldItem={item}
          newItem={currentItem}
        />
      )}
    </>
  )
}

const Anniversary = () => {
  const [sort, setSort] = useState<PrizeSortMethod>()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'x', 'freshman', 'prizes', sort],
    queryFn: async () => {
      const result = await getPrizes({ sort })
      setConfig(result.config)
      return result
    },
  })
  const [config, setConfig] = useState<LuckyDrawConfig>()
  const [saveConfigPending, setSaveConfigPending] = useState(false)

  const saveConfig = async () => {
    if (!config) {
      return
    }
    setSaveConfigPending(true)
    try {
      await updateConfig(config)
      await refetch()
    } finally {
      setSaveConfigPending(false)
    }
  }
  const addVerifier = (user: User) => {
    if (!config?.verifier_uids?.includes(user.uid)) {
      setConfig({
        ...config,
        verifier_uids: (config?.verifier_uids || []).concat(user.uid),
        verifier_users: (config?.verifier_users || []).concat(user),
      })
    }
  }
  const removeVerifier = (uid: number) => {
    setConfig({
      ...config,
      verifier_uids: config?.verifier_uids?.filter((item) => item != uid),
      verifier_users: config?.verifier_users?.filter((item) => item.uid != uid),
    })
  }

  if (isLoading) {
    return (
      <Stack alignItems="center" my={5}>
        <CircularProgress />
      </Stack>
    )
  }
  if (isError) {
    return <Error error={error} />
  }
  if (!data) {
    return <></>
  }
  return (
    <Box>
      <Typography variant="h5" mb={2}>
        奖品列表
      </Typography>
      <div
        css={{
          display: 'grid',
          grid: 'auto-flow / 2fr 1fr 1fr 1fr 1fr 1fr 1fr max-content',
          alignItems: 'center',
          gap: '1em',
        }}
      >
        <div>名称</div>
        <div>总数</div>
        <div>剩余</div>
        <div>概率 1</div>
        <div>概率 2</div>
        <div>概率 3</div>
        <div>领奖方式</div>
        <div>操作</div>
        {data.prizes?.map((item) => (
          <PrizeRow key={item.id} item={item} onRefresh={refetch} />
        ))}
        <PrizeRow onRefresh={refetch} />
      </div>
      <Typography variant="h5" mt={4} mb={2}>
        统计数据
      </Typography>
      <Stack>
        <Typography>
          奖品总数：{data.total_gifts}，剩余奖品：{data.remaining_gifts}（
          {Math.round(
            ((data.total_gifts - data.remaining_gifts) / data.total_gifts) *
              1000
          ) / 10}
          %）
        </Typography>
        <Typography>兑换尝试次数：{data.total_attempts}</Typography>
        <Typography>
          兑换码数量：{data.total_codes} (已兑换 {data.claimed_codes} 剩余{' '}
          {data.total_codes - data.claimed_codes} /{' '}
          {Math.round((data.claimed_codes / data.total_codes) * 1000) / 10}% )
        </Typography>
        <Typography>
          中奖人数：总计 {data.total_prize_users}，实物奖励{' '}
          {data.claimed_codes_with_gift}
          ，新生 {data.freshman_prize_users}
          ，本科新生 {data.undergraduate_freshman_prize_users}，新注册用户{' '}
          {data.new_register_prize_users}
        </Typography>
      </Stack>
      <Typography variant="h5" mt={4} mb={2}>
        配置
      </Typography>
      <Stack alignItems="flex-start">
        <FormControlLabel
          control={
            <Checkbox
              checked={!!config?.allow_code2}
              onChange={(e) =>
                setConfig({ ...config, allow_code2: e.target.checked })
              }
            />
          }
          label="允许使用兑换码"
        />
        <Typography variant="h6">核销人员：</Typography>
        <Stack direction="row" flexWrap="wrap">
          {config?.verifier_users?.map((item) => (
            <Stack
              direction="row"
              alignItems="center"
              key={item.uid}
              mr={1}
              my={1}
            >
              <Link to={pages.user({ uid: item.uid })} target="_blank">
                <Stack direction="row" alignItems="center">
                  <Avatar uid={item.uid} size={24} />
                  <Typography ml={1}>{item.username}</Typography>
                </Stack>
              </Link>
              <IconButton onClick={() => removeVerifier(item.uid)}>
                <RemoveCircle />
              </IconButton>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" alignItems="center" my={1}>
          <Typography>添加核销人员：</Typography>
          <UserChooser onChoose={(user) => addVerifier(user)} />
        </Stack>
        <Typography variant="h6" mb={1}>
          水滴范围：
        </Typography>
        <Stack direction="row" flexWrap="wrap" alignItems="center" mb={1}>
          <WaterInput config={config} setConfig={setConfig} index={1} />
          <WaterInput config={config} setConfig={setConfig} index={2} />
          <WaterInput config={config} setConfig={setConfig} index={3} />
        </Stack>
        <Button
          onClick={saveConfig}
          disabled={saveConfigPending}
          variant="outlined"
        >
          保存
        </Button>
      </Stack>
      <Typography variant="h5" mt={4} mb={2}>
        中奖用户 ({data.total_prize_users})
      </Typography>
      <div
        css={{
          display: 'grid',
          grid: 'auto-flow / 1fr 1fr 1fr max-content max-content max-content',
          alignItems: 'center',
          gap: '1em',
        }}
      >
        <SortableColumn
          sort={sort}
          setSort={setSort}
          label="用户名"
          sort1={PrizeSortMethod.ByUser}
        />
        <SortableColumn
          sort={sort}
          setSort={setSort}
          label="水滴"
          sort1={PrizeSortMethod.ByWaterDesc}
          sort2={PrizeSortMethod.ByWaterAsc}
        />
        <div onClick={() => setSort(undefined)}>奖品</div>
        <div>兑换码</div>
        <SortableColumn
          sort={sort}
          setSort={setSort}
          label="扫码时间"
          sort1={PrizeSortMethod.ByDatelineDesc}
          sort2={PrizeSortMethod.ByDatelineAsc}
        />
        <SortableColumn
          sort={sort}
          setSort={setSort}
          label="奖品核销"
          sort1={PrizeSortMethod.ClaimedFirst}
          sort2={PrizeSortMethod.NotClaimedFirst}
          Icon1={CheckCircle}
          Icon2={Pending}
        />
        {data.users?.map((item, index) => (
          <React.Fragment key={index}>
            <Link to={pages.user({ uid: item.uid })}>
              <Stack direction="row" alignItems="center">
                <Avatar uid={item.uid} size={24} />
                <Typography ml={1}>{item.username}</Typography>
              </Stack>
            </Link>
            <Typography>{item.water}</Typography>
            <Typography>{item.prize_name}</Typography>
            <Typography>{item.code2}</Typography>
            <Typography>
              {chineseTime(item.validation_time, { full: true, seconds: true })}
            </Typography>
            <Typography>{item.claimed ? '已核销' : ''}</Typography>
          </React.Fragment>
        ))}
      </div>
    </Box>
  )
}

const UserChooser = ({ onChoose }: { onChoose?: (user: User) => void }) => {
  const [loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState<SearchSummaryUser[]>([])
  const fetch = useMemo(
    () =>
      debounce(
        async (
          keyword: string,
          callback: (result: SearchSummaryUser[]) => void
        ) => {
          setLoading(true)
          try {
            const summary = await searchSummary(keyword)
            const users = summary.users || []
            if (summary.uid_match) {
              users.unshift(summary.uid_match)
            }
            callback(users)
          } finally {
            setLoading(false)
          }
        },
        400
      ),
    []
  )
  const chooseUser = (user: SearchSummaryUser) => {
    setValue(user.username)
    setOpen(false)
    onChoose &&
      onChoose({
        uid: user.uid,
        username: user.username,
      })
  }
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  return (
    <Autocomplete
      sx={{ width: '16em' }}
      loading={loading}
      size="small"
      freeSolo
      renderInput={(params) => (
        <TextField {...params} variant="standard" sx={{ px: 2 }} />
      )}
      renderOption={(props, item) => (
        <li {...props} onClick={() => chooseUser(item)}>
          <Stack direction="row" alignItems="center">
            <Avatar uid={item.uid} size={24} />
            <Typography ml={1}>{item.username}</Typography>
          </Stack>
        </li>
      )}
      getOptionLabel={(option) =>
        typeof option == 'object' ? option.username : value
      }
      options={candidates}
      filterOptions={(x) => x}
      onInputChange={(_, value) => {
        setValue(value)
        if (!value) {
          return
        }
        return fetch(value, (result) => setCandidates(result))
      }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    />
  )
}

const SortableColumn = ({
  sort,
  setSort,
  label,
  sort1,
  sort2,
  Icon1,
  Icon2,
}: {
  sort?: PrizeSortMethod
  setSort: (sort?: PrizeSortMethod) => void
  label: string
  sort1: PrizeSortMethod
  sort2?: PrizeSortMethod
  Icon1?: React.ElementType
  Icon2?: React.ElementType
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      onClick={() => setSort(sort == sort1 ? sort2 : sort1)}
    >
      <Typography mr={1}>{label}</Typography>
      {sort == sort1 &&
        (Icon1 ? <Icon1 /> : sort2 ? <KeyboardDoubleArrowDown /> : <Sort />)}
      {sort == sort2 &&
        sort2 &&
        (Icon2 ? <Icon2 /> : <KeyboardDoubleArrowUp />)}
    </Stack>
  )
}

const WaterInput = ({
  config,
  setConfig,
  index,
}: {
  config?: LuckyDrawConfig
  setConfig: (config?: LuckyDrawConfig) => void
  index: 1 | 2 | 3
}) => {
  const get = (max: boolean) => {
    switch (index) {
      case 1:
        return (max ? config?.water_max1 : config?.water_min1) ?? ''
      case 2:
        return (max ? config?.water_max2 : config?.water_min2) ?? ''
      case 3:
        return (max ? config?.water_max3 : config?.water_min3) ?? ''
    }
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    max: boolean
  ) => {
    const value = parseInt(e.target.value)
    if (isNaN(value) || value < 0) {
      return
    }
    switch (index) {
      case 1:
        if (max) {
          setConfig({ ...config, water_max1: value })
        } else {
          setConfig({ ...config, water_min1: value })
        }
        break
      case 2:
        if (max) {
          setConfig({ ...config, water_max2: value })
        } else {
          setConfig({ ...config, water_min2: value })
        }
        break
      case 3:
        if (max) {
          setConfig({ ...config, water_max3: value })
        } else {
          setConfig({ ...config, water_min3: value })
        }
        break
    }
  }
  const textProps: TextFieldProps = {
    size: 'small',
    type: 'number',
    sx: { width: '5em' },
  }
  return (
    <Stack direction="row" alignItems="center" mr={2} mb={1}>
      <Typography variant="h6" mr={1}>
        {index})
      </Typography>
      <TextField
        {...textProps}
        value={get(false)}
        onChange={(e) => handleChange(e, false)}
      />
      <Typography mx={1}>~</Typography>
      <TextField
        {...textProps}
        value={get(true)}
        onChange={(e) => handleChange(e, true)}
      />
    </Stack>
  )
}

export default Anniversary
