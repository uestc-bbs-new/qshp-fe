import { useQuery } from '@tanstack/react-query'

import {
  AddLink,
  CheckBox,
  CollectionsBookmark,
  DeleteRounded,
  LibraryAdd,
  StarBorderRounded,
  SvgIconComponent,
} from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material'

import { getThreadFavorite } from '@/apis/thread'
import { PostFloor } from '@/common/interfaces/response'
import { PublicThreadFavoriteFolder } from '@/common/interfaces/thread'
import Avatar from '@/components/Avatar'
import GeneralDialog from '@/components/GeneralDialog'
import siteRoot from '@/utils/siteRoot'

const FavoriteItem = ({
  item,
  text,
  IconComponent,
  iconProps,
  favorite,
  noButton,
  disabled,
  onClick,
  onButtonClick,
}: {
  item?: PublicThreadFavoriteFolder
  text?: string
  IconComponent?: SvgIconComponent
  iconProps?: SvgIconProps
  favorite?: boolean
  noButton?: boolean
  disabled?: boolean
  onClick?: () => void
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const kIconSize = 32
  const iconProps2 = {
    htmlColor: '#aaaaaa',
    sx: { width: 0.9 * kIconSize, height: 0.9 * kIconSize },
    ...iconProps,
  }
  const children = (
    <Stack width="100%" direction="row" justifyContent="space-between">
      <Stack direction="row" alignItems="center">
        {item?.is_owner || !item ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            width={kIconSize}
            height={kIconSize}
          >
            {IconComponent && <IconComponent {...iconProps2} />}
          </Stack>
        ) : (
          <Avatar alt={item.username} uid={item.owner_uid} size={kIconSize} />
        )}
        <Stack mx={1}>
          <Typography>{item ? item.name : text}</Typography>
        </Stack>
      </Stack>
      {!noButton && (
        <IconButton onClick={onButtonClick} disabled={disabled}>
          {favorite ? <DeleteRounded color="error" /> : <StarBorderRounded />}
        </IconButton>
      )}
    </Stack>
  )
  const itemProps = {
    onClick,
  }
  return favorite ? (
    <ListItem {...itemProps}>{children}</ListItem>
  ) : (
    <ListItemButton {...itemProps} disabled={disabled}>
      {children}
    </ListItemButton>
  )
}

export const FavoriteDialog = ({
  open,
  onClose,
  post,
}: {
  open: boolean
  onClose?: () => void
  post: PostFloor
}) => {
  const { isLoading, data } = useQuery({
    queryKey: ['thread/favorite', post.thread_id],
    queryFn: () => getThreadFavorite(post.thread_id),
  })

  return (
    <GeneralDialog
      open={open}
      onClose={onClose}
      titleText="收藏帖子"
      actions={[]}
    >
      {isLoading ? (
        <Stack justifyContent="center" alignItems="center" px={10} py={6}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Typography variant="h6">个人收藏夹</Typography>
          <List>
            <FavoriteItem
              IconComponent={data?.is_personal_favorite ? CheckBox : AddLink}
              iconProps={
                data?.is_personal_favorite ? { color: 'success' } : undefined
              }
              text={data?.is_personal_favorite ? '已收藏' : '添加到个人收藏'}
              favorite={data?.is_personal_favorite}
            />
          </List>
          <Typography variant="h6">公共收藏夹（淘专辑）</Typography>
          <List>
            {data?.public_favorites?.map((item) => (
              <FavoriteItem
                key={item.collection_id}
                item={item}
                IconComponent={CollectionsBookmark}
                favorite={item.is_favorite}
              />
            ))}
            <FavoriteItem
              IconComponent={LibraryAdd}
              text="新建公共收藏夹（淘专辑）"
              noButton
              onClick={() =>
                window.open(`${siteRoot}/forum.php?mod=collection&action=edit`)
              }
            />
          </List>
        </>
      )}
    </GeneralDialog>
  )
}
