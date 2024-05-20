import { useQuery } from '@tanstack/react-query'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import EditNoteIcon from '@mui/icons-material/EditNote'
import { Box, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material'

import { getUserProfile } from '@/apis/user'
import { UserSummary } from '@/common/interfaces/user'
import Link from '@/components/Link'
import { UserHtmlRenderer } from '@/components/RichText'
import { chineseTime } from '@/utils/dayjs'
import { isPreviewRelease } from '@/utils/releaseMode'
import { pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'

import { SubPageCommonProps } from './types'

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <>
    <Box m={1.5}>
      <Typography variant="userProfileHeading" mb={0.5} paragraph>
        {title}
      </Typography>
      {children}
    </Box>
    <Divider />
  </>
)

type FieldValueProps = {
  title: string
  text?: React.ReactNode
  children?: React.ReactNode
}

const FieldValue = ({ title, text, children }: FieldValueProps) => (
  <Stack direction="row">
    <Typography variant="userProfileField">{title}：</Typography>
    {text && <Typography variant="userProfileText">{text}</Typography>}
    {children}
  </Stack>
)

const FieldValueGrid = (props: FieldValueProps) => (
  <Grid item xs={6}>
    <FieldValue {...props} />
  </Grid>
)

const Information = ({
  userQuery,
  queryOptions,
  userSummary,
  onLoad,
  self,
}: SubPageCommonProps & { userSummary?: UserSummary; self: boolean }) => {
  const initQuery = () => ({ common: { ...userQuery, ...queryOptions } })
  const [query, setQuery] = useState(initQuery())
  const { data } = useQuery({
    queryKey: ['user', 'profile', query],
    queryFn: async () => {
      const data = await getUserProfile(query.common)
      onLoad && onLoad(data)
      return data
    },
  })
  const [searchParams] = useSearchParams()
  useEffect(() => {
    setQuery(initQuery())
  }, [
    searchParams,
    userQuery.uid,
    userQuery.username,
    userQuery.removeVisitLog,
    userQuery.admin,
  ])
  return (
    <Box pt={1}>
      {self && (
        <>
          <Stack alignItems="flex-end" pb={1}>
            <Link
              to={
                isPreviewRelease
                  ? `${siteRoot}/home.php?mod=spacecp&ac=profile`
                  : pages.settings('profile')
              }
              external={isPreviewRelease}
              target={isPreviewRelease ? '_blank' : undefined}
            >
              <Stack direction="row" alignItems="center">
                <Typography fontSize={12} align="right" className="m-1">
                  编辑
                </Typography>
                <EditNoteIcon />
              </Stack>
            </Link>
          </Stack>
          <Divider />
        </>
      )}
      {data ? (
        <>
          <Section title="基本信息">
            <Grid container>
              <FieldValueGrid title="UID" text={userSummary?.uid} />
              {data.email && <FieldValueGrid title="Email" text={data.email} />}
            </Grid>
          </Section>
          {data.introduction && (
            <Section title="自我介绍">
              <Typography variant="userProfileText" whiteSpace="pre-wrap">
                {data.introduction}
              </Typography>
            </Section>
          )}
          {data.custom_title && (
            <Section title="自定义头衔">
              <Typography variant="userProfileText">
                {data.custom_title}
              </Typography>
            </Section>
          )}
          {data.signature && (
            <Section title="个人签名">
              {data.signature_format == 'html' && (
                <UserHtmlRenderer html={data.signature} />
              )}
            </Section>
          )}
          <Section title="活跃概况">
            <Grid container spacing={1}>
              <FieldValueGrid
                title="在线时间"
                text={`${data.online_time} 小时`}
              />
              <FieldValueGrid
                title="注册时间"
                text={chineseTime(data.register_time * 1000)}
              />
              {data.register_ip && (
                <FieldValueGrid title="注册 IP" text={data.register_ip} />
              )}
              <FieldValueGrid
                title="最后访问"
                text={chineseTime(data.last_visit * 1000)}
              />
              <FieldValueGrid
                title="上次活动"
                text={chineseTime(data.last_activity * 1000)}
              />
              {data.last_ip && (
                <FieldValueGrid title="上次访问 IP" text={data.last_ip} />
              )}
              <FieldValueGrid
                title="上次发表"
                text={chineseTime(data.last_post * 1000)}
              />
            </Grid>
          </Section>
        </>
      ) : (
        [...Array(5)].map((_, index) => <Skeleton key={index} height={73} />)
      )}
    </Box>
  )
}

export default Information
