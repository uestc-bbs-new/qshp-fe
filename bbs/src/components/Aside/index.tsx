import React from 'react'

import { Box } from '@mui/material'

import { TopList } from '@/common/interfaces/response'
import { useTopList } from '@/states'

import SideTabs from '../TopList/SideTabs'

const Aside = ({
  loading,
  topList,
  homepage,
}: {
  loading?: boolean
  topList?: TopList
  homepage?: boolean
}) => {
  const data = homepage ? topList : useTopList(topList)
  return (
    <Box className="ml-2 w-60">
      <SideTabs {...{ loading, topList: data, homepage }} />
    </Box>
  )
}

export default Aside
