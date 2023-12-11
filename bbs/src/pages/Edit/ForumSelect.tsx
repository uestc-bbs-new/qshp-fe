import { useEffect, useState } from 'react'

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
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { Forum } from '@/common/interfaces/response'
import Link from '@/components/Link'
import { useAppState } from '@/states'

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
  const { state } = useAppState()
  const fidNameMap: { [fid: number]: string } = {}
  const addToMap = (forum: Forum) => {
    fidNameMap[forum.fid] = forum.name
    forum.children?.length && forum.children.forEach(addToMap)
  }
  state.forumList.forEach(addToMap)

  return (
    <Link
      to={`/post/${fid}`}
      onClick={(e) => {
        e.preventDefault()
        onClick(fid)
      }}
    >
      {fidNameMap[fid]}
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
  const { state } = useAppState()
  const theme = useTheme()
  const [fid, setFid] = useState(selectedFid)
  const close = () => {
    onCompleted(fid)
  }
  useEffect(() => {
    setFid(selectedFid)
  }, [selectedFid])
  const [subForumsOpen, setSubForumsOpen] = useState<{
    [fid: number]: boolean
  }>({})

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onChooseForum = (
    e: React.MouseEvent<HTMLElement>,
    forum: Forum,
    noSub?: boolean
  ) => {
    if (forum.children?.length && !noSub) {
      setAnchorEl(e.currentTarget)
      setSubForumsOpen(Object.assign({}, subForumsOpen, { [forum.fid]: true }))
    } else {
      setSubForumsOpen({})
      onCompleted(forum.fid)
    }
  }
  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">请选择板块：</Typography>
          <IconButton onClick={close}>
            <Close />
          </IconButton>
        </Stack>
        <Typography variant="body1">
          灌水帖请在
          <ForumLink fid={25} onClick={onCompleted} />
          发表，物品交易请在
          <ForumLink fid={61} onClick={onCompleted} />
          发表，对河畔或管理组的意见建议、使用中遇到的问题请在
          <ForumLink fid={46} onClick={onCompleted} />
          发表。
        </Typography>
      </DialogTitle>
      <DialogContent>
        {state.forumList.map((group, index) => (
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
                    <Grid item rowSpacing={0} xs={3} key={index}>
                      <Button
                        size="large"
                        color={
                          isForumOrChildrenSelected(item, fid)
                            ? 'success'
                            : 'primary'
                        }
                        disabled={!canPostThreadInForumOrChildren(item)}
                        onClick={(e) => onChooseForum(e, item)}
                      >
                        {item.name}
                      </Button>
                      {!!item.children?.length && (
                        <Menu
                          open={subForumsOpen[item.fid]}
                          onClose={() =>
                            setSubForumsOpen(
                              Object.assign({}, subForumsOpen, {
                                [item.fid]: false,
                              })
                            )
                          }
                          anchorEl={anchorEl}
                        >
                          {item.can_post_thread && (
                            <>
                              <MenuItem
                                selected={item.fid == fid}
                                onClick={(e) => onChooseForum(e, item, true)}
                              >
                                {item.name}
                              </MenuItem>
                              <Divider />
                            </>
                          )}
                          {item.children.map((sub, index) => (
                            <MenuItem
                              key={index}
                              selected={sub.fid == fid}
                              disabled={!sub.can_post_thread}
                              onClick={(e) => onChooseForum(e, sub)}
                            >
                              {sub.name}
                            </MenuItem>
                          ))}
                        </Menu>
                      )}
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  )
}
