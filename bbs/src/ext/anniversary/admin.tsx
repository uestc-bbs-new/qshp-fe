import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'

import {
  Add,
  CheckCircle,
  Delete,
  EditNote,
  FastForward,
} from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import Avatar from '@/components/Avatar'
import Error from '@/components/Error'
import Link from '@/components/Link'
import { chineseTime } from '@/utils/dayjs'
import { pages } from '@/utils/routes'

import {
  LuckyDrawPrize,
  addPrize,
  deletePrize,
  getPrizes,
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
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'x', 'freshman', 'prizes'],
    queryFn: getPrizes,
  })
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
        <div>用户名</div>
        <div>水滴</div>
        <div>奖品</div>
        <div>兑换码</div>
        <div>扫码时间</div>
        <div>奖品核销</div>
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

export default Anniversary
