import { Grid, Skeleton, Stack, useMediaQuery } from '@mui/material'

import { ThreadBasics, TopListKey } from '@/common/interfaces/response'
import { useAppState } from '@/states'

import HeaderCard, { TabbedHeaderCard } from '../TopList/HeaderCard'

const SkeletonColumn = () => (
  <Stack>
    <Skeleton height={72.5} />
    {[...Array(8)].map((_, index) => (
      <Skeleton height={47.5} key={index} />
    ))}
  </Stack>
)

const HeaderCards = ({
  topLists,
  loading,
}: {
  topLists?: { [id: string]: ThreadBasics[] | undefined }
  loading?: boolean
}) => {
  const topKeys: TopListKey[] = ['newreply', 'newthread', 'digest']
  const tabbedTopView = useMediaQuery('(max-width: 1080px)')
  const { state } = useAppState()
  const renderTopLists = !!(state.user.uid && topLists)
  const renderSkeleton = !topLists && loading

  return (
    <>
      <Grid container spacing={tabbedTopView ? 1 : 2} mb={2}>
        {tabbedTopView ? (
          <>
            <Grid item xs={6}>
              {renderTopLists && (
                <TabbedHeaderCard
                  ids={['newreply', 'newthread']}
                  initialId={'newthread'}
                  topLists={topLists}
                />
              )}
              {renderSkeleton && <SkeletonColumn />}
            </Grid>
            <Grid item xs={6}>
              {renderTopLists && (
                <TabbedHeaderCard
                  ids={['digest', 'life', 'hotlist']}
                  topLists={topLists}
                />
              )}
              {renderSkeleton && <SkeletonColumn />}
            </Grid>
          </>
        ) : (
          topKeys.map((key) => (
            <Grid key={key} item xs={4}>
              {renderTopLists && (
                <HeaderCard id={key} list={topLists[key] || []} />
              )}
              {renderSkeleton && <SkeletonColumn />}
            </Grid>
          ))
        )}
      </Grid>
    </>
  )
}
export default HeaderCards
