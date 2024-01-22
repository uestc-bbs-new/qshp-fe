import React from 'react'

import { Box } from '@mui/material'

import { TopList } from '@/common/interfaces/response'

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
  return (
    <Box className="ml-2 w-60">
      <SideTabs {...{ loading, topList, homepage }} />
    </Box>
  )
}

export default Aside
