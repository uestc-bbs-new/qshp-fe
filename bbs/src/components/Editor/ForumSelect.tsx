import { useEffect, useRef, useState } from 'react'

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { Forum } from '@/common/interfaces/forum'
import Link from '@/components/Link'
import Tooltip from '@/components/Tooltip'
import { globalCache, useForumList } from '@/states'
import { pages } from '@/utils/routes'

const canPostThreadInForumOrChildren = (forum: Forum) => {
  return (
    forum.can_post_thread ||
    (forum.children?.length &&
      forum.children.some((item) => item.can_post_thread))
  )
}

const isForumOrChildrenSelected = (forum: Forum, fid?: number) => {
  if (!fid) {
    return false
  }
  if (forum.fid == fid) {
    return true
  }
  return (
    forum.children?.length && forum.children.some((item) => item.fid == fid)
  )
}

const ForumLink = ({
  fid,
  onClick,
}: {
  fid: number
  onClick: (fid: number) => void
}) => {
  return (
    <Link
      to={pages.post(fid)}
      onClick={(e) => {
        e.preventDefault()
        onClick(fid)
      }}
    >
      {globalCache.fidNameMap[fid]}
    </Link>
  )
}

export const ForumSelect = ({
  open,
  selectedFid,
  onCompleted,
}: {
  open: boolean
  selectedFid?: number
  onCompleted: (forum: number | undefined) => void
}) => {
  const thinView = useMediaQuery('(max-width: 560px)')
  return (
    <Dialog open={open} PaperProps={thinView ? { sx: { mx: 2 } } : undefined}>
      {open && <ForumSelectDialogChildren {...{ selectedFid, onCompleted }} />}
    </Dialog>
  )
}

const ForumSelectDialogChildren = ({
  selectedFid,
  onCompleted,
}: {
  selectedFid?: number
  onCompleted: (forum: number | undefined) => void
}) => {
  const forumList = useForumList()
  return (
    <>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">请选择板块：</Typography>
          <IconButton onClick={() => onCompleted(selectedFid)}>
            <Close />
          </IconButton>
        </Stack>
        {forumList && (
          <Typography variant="body1">
            灌水帖请在
            <ForumLink fid={25} onClick={onCompleted} />
            发表，物品交易请在
            <ForumLink fid={61} onClick={onCompleted} />
            发表，对河畔或管理组的意见建议、使用中遇到的问题请在
            <ForumLink fid={46} onClick={onCompleted} />
            发表。
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {forumList ? (
          <ForumList {...{ selectedFid, onCompleted, forumList }} />
        ) : (
          [...Array(8)].map((_, index) => <Skeleton key={index} height={80} />)
        )}
      </DialogContent>
    </>
  )
}

const ForumList = ({
  selectedFid,
  forumList,
  onCompleted,
}: {
  selectedFid?: number
  forumList: Forum[]
  onCompleted: (forum: number | undefined) => void
}) => {
  const theme = useTheme()
  const [fid, setFid] = useState(selectedFid)
  useEffect(() => {
    setFid(selectedFid)
  }, [selectedFid])

  const onChooseForum = (forum: Forum, noSub?: boolean) => {
    if (!forum.children?.length || noSub) {
      onCompleted(forum.fid)
    }
  }
  return forumList.map((group, index) => (
    <Box key={index}>
      <ListItemText>{group.name}</ListItemText>
      <Divider
        className="border-b-2 rounded-lg"
        style={{ borderBottomColor: theme.palette.primary.main }}
      />
      <Box pl={4}>
        <Grid container spacing={0.5} mt={0} ml={0}>
          {group.children
            ?.filter((item) => item.name)
            .map((item, index) => (
              <ForumButton
                key={index}
                item={item}
                fid={fid}
                onChooseForum={onChooseForum}
              />
            ))}
        </Grid>
      </Box>
    </Box>
  ))
}

const ForumButton = ({
  item,
  fid,
  onChooseForum,
}: {
  item: Forum
  fid?: number
  onChooseForum: (forum: Forum, noSub?: boolean) => void
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const button = (
    <Button
      size="large"
      color={isForumOrChildrenSelected(item, fid) ? 'success' : 'primary'}
      disabled={!canPostThreadInForumOrChildren(item)}
      onClick={() => onChooseForum(item)}
      ref={buttonRef}
    >
      {item.name}
    </Button>
  )
  const thinView = useMediaQuery('(max-width: 560px)')
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const hasSub =
    item.children?.length &&
    item.children.some((subForum) => subForum.can_post_thread)
  return (
    <Grid
      item
      rowSpacing={0}
      xs={thinView ? 6 : 4}
      sm={3}
      onTouchStart={() => hasSub && setTimeout(() => setTooltipOpen(true), 300)}
    >
      {hasSub ? (
        <Tooltip
          open={tooltipOpen}
          onOpen={() => setTooltipOpen(true)}
          onClose={() => setTooltipOpen(false)}
          leaveTouchDelay={5000}
          placement="bottom-start"
          TransitionProps={{ timeout: 500 }}
          PopperProps={{
            sx: {
              // HACK: We have to write this to override MUI's default offset.
              '&[data-popper-placement] .MuiTooltip-tooltipPlacementBottom': {
                marginTop: '7px',
              },
            },
            anchorEl: {
              getBoundingClientRect: () => {
                const buttonRect = buttonRef.current?.getBoundingClientRect()
                return new DOMRect(
                  // -9999 to avoid flashing at (0, 0) on closing the dialog.
                  buttonRect?.x || -9999,
                  buttonRect?.y || -9999,
                  0,
                  0
                )
              },
            },
          }}
          title={
            <>
              {(item.can_post_thread
                ? [
                    <MenuItem
                      key="main forum"
                      selected={item.fid == fid}
                      onClick={() => onChooseForum(item, true)}
                    >
                      {item.name}
                    </MenuItem>,
                    <Divider key="divider" />,
                  ]
                : []
              ).concat(
                item.children?.map((sub, index) => (
                  <MenuItem
                    key={index}
                    selected={sub.fid == fid}
                    disabled={!sub.can_post_thread}
                    onClick={() => onChooseForum(sub)}
                  >
                    {sub.name}
                  </MenuItem>
                )) ?? []
              )}
            </>
          }
        >
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </Grid>
  )
}
