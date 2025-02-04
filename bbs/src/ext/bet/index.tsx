import { useQuery } from '@tanstack/react-query'

import React, { useState } from 'react'

import { Button, Stack, Typography } from '@mui/material'

import { useAppState } from '@/states'
import { chineseTime } from '@/utils/dayjs'

import { AdminSettingsDialog } from './admin_settings'
import { BetCompetition, BetDetails, getList, translateBetStatus } from './api'
import { BetSubmitDialog } from './bet'
import { BetEditDialog } from './edit'

export const Index = () => {
  const { state } = useAppState()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['x/bet/list', 1],
    queryFn: async () => {
      return await getList(1)
    },
  })
  const [editBetOpen, setEditBetOpen] = useState(false)
  const [activeEditBet, setActiveEditBet] = useState<BetDetails>()
  const [betSubmitOpen, setBetSubmitOpen] = useState(false)
  const [activeCompetition, setActiveCompetition] = useState<BetCompetition>()
  const [adminOpen, setAdminOpen] = useState(false)
  return (
    <>
      <Typography variant="h4" textAlign="center" color="Highlight">
        水滴竞猜
      </Typography>
      {(data?.can_create || data?.can_manage_settings) && (
        <Stack direction="row" justifyContent="flex-end" spacing={2} my={2}>
          {data?.can_create && (
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                setActiveEditBet(undefined)
                setEditBetOpen(true)
              }}
            >
              开新盘
            </Button>
          )}
          {data?.can_manage_settings && (
            <Button variant="outlined" onClick={() => setAdminOpen(true)}>
              管理
            </Button>
          )}
        </Stack>
      )}
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 2fr) repeat(3, 1fr)',
          justifyItems: 'center',
          alignItems: 'center',
          gap: '0.5em',
        }}
      >
        <Typography variant="h6" justifySelf="start">
          竞猜内容
        </Typography>
        <Typography variant="h6">赔率信息</Typography>
        <Typography variant="h6">结束时间</Typography>
        <Typography variant="h6">状态</Typography>
        <Typography variant="h6">操作</Typography>
        {data?.rows?.map((item) => (
          <React.Fragment key={item.id}>
            <Typography variant="h6" justifySelf="start">
              {item.title}
            </Typography>
            <Stack direction="row" flexWrap="wrap" columnGap={3}>
              {item.options?.map((option) => (
                <Typography key={option.id}>
                  {option.text} ({option.rate})
                </Typography>
              ))}
            </Stack>
            <Typography>
              {item.end_time ? chineseTime(item.end_time) : '暂无'}
            </Typography>
            <Typography>{translateBetStatus(item.status)}</Typography>
            <Stack direction="row">
              {item.can_admin && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setActiveEditBet(item)
                    setEditBetOpen(true)
                  }}
                >
                  编辑
                </Button>
              )}
              {item.status == 'active' &&
                item.creator_uid != state.user.uid &&
                (item.bet_option && item.bet_amount ? (
                  <Button variant="outlined">已投注</Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setActiveCompetition(item)
                      setBetSubmitOpen(true)
                    }}
                  >
                    马上投注
                  </Button>
                ))}
            </Stack>
          </React.Fragment>
        ))}
      </div>
      {editBetOpen && (
        <BetEditDialog
          open
          initialValue={activeEditBet}
          onClose={(shouldRefresh) => {
            setEditBetOpen(false)
            if (shouldRefresh) {
              refetch()
            }
          }}
        />
      )}
      {betSubmitOpen && activeCompetition && (
        <BetSubmitDialog
          open
          onClose={() => setBetSubmitOpen(false)}
          competition={activeCompetition}
        />
      )}
      {adminOpen && (
        <AdminSettingsDialog open onClose={() => setAdminOpen(false)} />
      )}
    </>
  )
}
