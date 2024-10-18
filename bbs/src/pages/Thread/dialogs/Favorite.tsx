import { useQuery } from '@tanstack/react-query'

import { useState } from 'react'

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

import { parseApiError } from '@/apis/error'
import { favoriteThread, getThreadFavorite } from '@/apis/thread'
import { deleteUserFavorite } from '@/apis/user'
import { PostFloor } from '@/common/interfaces/response'
import { PublicThreadFavoriteFolder } from '@/common/interfaces/thread'
import Avatar from '@/components/Avatar'
import GeneralDialog from '@/components/GeneralDialog'
import { useAppState } from '@/states'
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
}: {
  item?: PublicThreadFavoriteFolder
  text?: string
  IconComponent?: SvgIconComponent
  iconProps?: SvgIconProps
  favorite?: boolean
  noButton?: boolean
  disabled?: boolean
  onClick?: (closeAfterComplete: boolean) => void
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
        <IconButton
          onClick={
            onClick
              ? (e) => {
                  e.stopPropagation()
                  onClick(false)
                }
              : undefined
          }
          disabled={disabled}
        >
          {favorite ? <DeleteRounded color="error" /> : <StarBorderRounded />}
        </IconButton>
      )}
    </Stack>
  )
  const itemProps = {
    onClick: onClick ? () => !favorite && onClick(true) : undefined,
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
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['thread/favorite', post.thread_id],
    queryFn: () => getThreadFavorite(post.thread_id),
  })
  const { dispatch } = useAppState()
  const [pending, setPending] = useState(false)

  const favorite = async (
    collection_id: number | undefined,
    is_favorite: boolean | undefined,
    closeAfterComplete: boolean
  ) => {
    const favoriteFolder = {
      personal_favorite: collection_id == undefined,
      collection_id,
    }
    let message = '已收藏'
    let severity = 'success'
    try {
      setPending(true)
      if (is_favorite) {
        message = '已删除'
        await deleteUserFavorite({
          ...favoriteFolder,
          tid_list: [post.thread_id],
        })
      } else {
        await favoriteThread(post.thread_id, { ...favoriteFolder })
      }
    } catch (e) {
      ;({ message, severity } = parseApiError(e))
    } finally {
      setPending(false)
    }
    if (severity != 'success' || closeAfterComplete) {
      dispatch({
        type: 'open snackbar',
        payload: {
          severity,
          message,
        },
      })
    }
    if (severity == 'success') {
      if (closeAfterComplete) {
        onClose && onClose()
      } else {
        await refetch()
      }
    }
  }
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
              onClick={(closeAfterComplete) =>
                favorite(
                  undefined,
                  data?.is_personal_favorite,
                  closeAfterComplete
                )
              }
              disabled={pending}
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
                onClick={(closeAfterComplete) =>
                  favorite(
                    item.collection_id,
                    item.is_favorite,
                    closeAfterComplete
                  )
                }
                disabled={pending}
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
