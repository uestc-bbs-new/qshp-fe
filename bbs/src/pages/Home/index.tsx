import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { Box, List, Skeleton, Stack, Typography, useTheme } from '@mui/material'

import { getTopLists } from '@/apis/common'
import headerImg from '@/assets/header.jpg'
import Aside from '@/components/Aside'
import Banner from '@/components/Banner'
import CampusService from '@/components/Header/CampusService'
import HeaderCards from '@/components/Header/HeaderCards'
import OverviewInfo from '@/components/Header/OverviewInfo'
import { useAppState } from '@/states'

import { ForumGroup } from './ForumCover'

const Home = () => {
  const { state } = useAppState()

  const theme = useTheme()
  const {
    data: topLists,
    isLoading,
    refetch,
  } = useQuery('toplist', () => {
    return getTopLists(['newreply', 'newthread', 'digest'])
  })
  useEffect(() => {
    refetch()
  }, [state.user.uid])
  return (
    <>
      <Banner src={headerImg}>
        <Box className="text-white text-center">
          <Typography variant="h4">清水河畔</Typography>
          <Typography color={theme.palette.grey[400]}>
            说你想说，做你想做
          </Typography>
        </Box>
      </Banner>
      <OverviewInfo />
      {!topLists && isLoading ? (
        <Skeleton height={394} />
      ) : (
        topLists && state.user.uid && <HeaderCards topLists={topLists} />
      )}
      <CampusService />

      <Stack direction="row">
        <Box className="flex-1">
          {!state || !state.forumList || state.forumList.length === 0 ? (
            <>
              <Skeleton variant="rounded" height={40} />
              <Box className="flex-1" display="flex">
                {Array.from(new Array(2)).map((index) => (
                  <Box
                    key={index}
                    sx={{ flexGrow: 1, marginRight: 1.1, my: 2 }}
                  >
                    <Skeleton variant="rectangular" height={118} />
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <List>
              {state.forumList.map((item) => (
                <ForumGroup data={item} key={item.name} />
              ))}
            </List>
          )}
        </Box>
        <Aside />
      </Stack>
    </>
  )
}
export default Home
