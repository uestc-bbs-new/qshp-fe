import { forwardRef } from 'react'

import { Pagination, useMediaQuery } from '@mui/material'

import { scrollAnchorSx } from '@/utils/scrollAnchor'

const ForumPagination = forwardRef(function ForumPagination(
  {
    count,
    page,
    onChange,
  }: {
    count: number
    page: number
    onChange: (_: React.ChangeEvent<unknown>, page: number) => void
  },
  ref
) {
  const thinView = useMediaQuery('(max-width: 560px)')
  return count > 1 ? (
    <Pagination
      size="small"
      count={count}
      page={page}
      onChange={onChange}
      boundaryCount={thinView ? 1 : 2}
      siblingCount={thinView ? 1 : 5}
      variant="outlined"
      shape="rounded"
      style={{ margin: '20px' }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        ...scrollAnchorSx,
      }}
      ref={ref}
    />
  ) : (
    <></>
  )
})

export default ForumPagination
