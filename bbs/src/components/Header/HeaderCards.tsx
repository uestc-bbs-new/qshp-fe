import { Grid, useMediaQuery } from '@mui/material'

import { ThreadBasics, TopListKey } from '@/common/interfaces/response'

import HeaderCard, { TabbedHeaderCard } from '../TopList/HeaderCard'

const HeaderCards = ({
  topLists,
}: {
  topLists: { [id: string]: ThreadBasics[] | undefined }
}) => {
  const topKeys: TopListKey[] = ['newreply', 'newthread', 'digest']
  const tabbedTopView = useMediaQuery('(max-width: 1080px)')
  return (
    <>
      <Grid container spacing={tabbedTopView ? 1 : 2} mb={2}>
        {tabbedTopView ? (
          <>
            <Grid item xs={6}>
              <TabbedHeaderCard
                ids={['newreply', 'newthread']}
                initialId={'newthread'}
                topLists={topLists}
              />
            </Grid>
            <Grid item xs={6}>
              <TabbedHeaderCard
                ids={['digest', 'life', 'hotlist']}
                topLists={topLists}
              />
            </Grid>
          </>
        ) : (
          topKeys.map((key) => (
            <Grid key={key} item xs={4}>
              <HeaderCard id={key} list={topLists[key] || []} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  )
}
export default HeaderCards
