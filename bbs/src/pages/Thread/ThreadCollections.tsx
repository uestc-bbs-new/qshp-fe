import { CollectionsBookmark } from '@mui/icons-material'
import { Grid } from '@mui/material'

import { Collection } from '@/apis/types/collection'
import { CollectionItemLite } from '@/components/Collection/Item'

import {
  PostExtraDetailsAccordian,
  PostExtraDetailsContainer,
} from './PostExtraDetails'

const ThreadCollections = ({ collections }: { collections: Collection[] }) => (
  <PostExtraDetailsContainer loading={false} hasContent={true}>
    <PostExtraDetailsAccordian
      Icon={CollectionsBookmark}
      title="收藏本帖的淘专辑"
    >
      <Grid container>
        {collections.map((item) => (
          <Grid key={item.collection_id} item xs={12} sm={6} py={1} pr={1}>
            <CollectionItemLite item={item} />
          </Grid>
        ))}
      </Grid>
    </PostExtraDetailsAccordian>
  </PostExtraDetailsContainer>
)

export default ThreadCollections
