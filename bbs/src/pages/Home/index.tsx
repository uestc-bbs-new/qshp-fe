import { Box, List } from '@mui/material'

import { useAppState } from '@/states'

import { ForumGroup } from './ForumCover'

const Home = () => {
  const { state } = useAppState()

  return (
    <>
      <Box className="flex-1">
        <List>
          {state.navList.map((item) => (
            <ForumGroup data={item} key={item.name} />
          ))}
        </List>
      </Box>
    </>
  )
}
export default Home
