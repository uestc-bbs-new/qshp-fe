import { Grid } from '@mui/material'

import { ThreadBasics, TopListKey } from '@/common/interfaces/response'
import { topListTitleMap } from '@/utils/constants'

import HeaderCard from '../TopList/HeaderCard'

const HeaderCards = ({
  topLists,
}: {
  topLists: { [id: string]: ThreadBasics[] | undefined }
}) => {
  const lists: TopListKey[] = ['newreply', 'newthread', 'digest']
  return (
    <>
      <Grid container spacing={3}>
        {lists.map((key) => (
          <Grid key={key} item xs={12} md={4}>
            {HeaderCard(topListTitleMap[key], topLists[key] || [])}
          </Grid>
        ))}
      </Grid>
    </>
  )
}
export default HeaderCards
