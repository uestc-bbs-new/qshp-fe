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
import { useAppState } from '@/states'

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
          justifyContent="spaceBetween"
          alignItems="center"
        >
          <Typography>请选择板块：</Typography>
          <IconButton onClick={close}>
            <Close />
          </IconButton>
        </Stack>
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
                        color={item.fid == fid ? 'success' : 'primary'}
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
                          <MenuItem
                            onClick={(e) => onChooseForum(e, item, true)}
                          >
                            {item.name}
                          </MenuItem>
                          <Divider />
                          {item.children.map((sub, index) => (
                            <MenuItem
                              key={index}
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
