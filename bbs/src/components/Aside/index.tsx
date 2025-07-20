import React from 'react'

import { Box, Typography } from '@mui/material'

import { TopList } from '@/common/interfaces/response'
import { useAppState, useTopList } from '@/states'
import { kAppBarTop } from '@/utils/scrollAnchor'

import SideTabs from '../TopList/SideTabs'

const AsideTabs = ({
  loading,
  topList,
  homepage,
}: {
  loading?: boolean
  topList?: TopList
  homepage?: boolean
}) => {
  const data = homepage ? topList : useTopList(topList)
  return <SideTabs {...{ loading, topList: data, homepage }} />
}

const Aside = (props: {
  loading?: boolean
  topList?: TopList
  homepage?: boolean
}) => {
  const { state } = useAppState()
  return (
    <Box className="ml-2 w-60" position="sticky" top={kAppBarTop}>
      {state.user.uid ? (
        <AsideTabs {...props} />
      ) : (
        <Typography mt={3} ml={1} color="#888">
          欢迎来到清水河畔！请您登录后查看更多精彩内容。
        </Typography>
      )}
    </Box>
  )
}

export default Aside
