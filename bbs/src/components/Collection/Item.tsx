import { Stack, Typography } from '@mui/material'

import { Collection } from '@/apis/types/collection'
import { legacyPages } from '@/utils/routes'

import Avatar from '../Avatar'
import Link from '../Link'
import Separated from '../Separated'

export const CollectionItemLite = ({ item }: { item: Collection }) => (
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
