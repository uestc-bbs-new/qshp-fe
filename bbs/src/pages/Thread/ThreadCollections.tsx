import { CollectionsBookmark } from '@mui/icons-material'
import { Grid, Stack, Typography } from '@mui/material'

import { Collection } from '@/common/interfaces/collection'
import Avatar from '@/components/Avatar'
import Link from '@/components/Link'
import Separated from '@/components/Separated'
import { legacyPages } from '@/utils/routes'

import {
  PostExtraDetailsAccordian,
  PostExtraDetailsContainer,
} from './PostExtraDetails'

const Item = ({ item }: { item: Collection }) => (
  <Stack direction="row" alignItems="center">
    <Avatar uid={item.uid} size={36} sx={{ mr: 2 }} />
    <Stack>
      <Link
        external
        target="_blank"
        to={legacyPages.collection(item.collection_id)}
      >
        {item.name}
      </Link>
      <Typography variant="userItemDetails">
        <Stack direction="row" spacing={0.75}>
          <Separated separator={<span>·</span>}>
            <span>主题：{item.threads}</span>
            <span>关注：{item.follows}</span>
          </Separated>
        </Stack>
      </Typography>
    </Stack>
  </Stack>
)

const ThreadCollections = ({ collections }: { collections: Collection[] }) => (
  <PostExtraDetailsContainer loading={false} hasContent={true}>
    <PostExtraDetailsAccordian
      Icon={CollectionsBookmark}
      title="收藏本帖的淘专辑"
    >
      <Grid container>
        {collections.map((item, index) => (
          <Grid key={item.collection_id} item xs={6} py={1} pr={1}>
            <Item item={item} />
          </Grid>
        ))}
      </Grid>
    </PostExtraDetailsAccordian>
  </PostExtraDetailsContainer>
)

export default ThreadCollections
