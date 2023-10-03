import { Box, List, ListItem, Skeleton } from '@mui/material'

import { useAppState } from '@/states'

import { ForumGroup } from './ForumCover'

const Home = () => {
  const { state } = useAppState()

  return (
    <>
      <Box className="flex-1">
        {!state || !state.navList || state.navList.length === 0 ? (
          <>
            <Skeleton variant="rounded" height={40} />
            <Box className="flex-1" display="flex">
              {Array.from(new Array(2)).map((index) => (
                <Box key={index} sx={{ flexGrow: 1, marginRight: 1.1, my: 2 }}>
                  <Skeleton variant="rectangular" height={118} />
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <List>
            {state.navList.map((item) => (
              <ForumGroup data={item} key={item.name} />
            ))}
          </List>
        )}
      </Box>
    </>
  )
}
export default Home
