import { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import WindowIcon from '@mui/icons-material/Window'
import {
  Box,
  Divider,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

// import { Thread } from '@/common/interfaces/response'
import { useAppState } from '@/states'

import Avatar from '../Avatar'
import Link from '../Link'

type PostProps = {
  thread?: boolean
  friend?: boolean
  favorate?: boolean
  message?: boolean
  className?: string
}

const basicIfo = [
  { id: 1, info: '积分' },
  { id: 2, info: '威望' },
  { id: 3, info: '水滴' },
  { id: 4, info: '奖励券' },
  { id: 5, info: '好友' },
  { id: 6, info: '主题' },
]

const Post = ({ friend, message, thread, favorate, className }: PostProps) => {
  const theme = useTheme()

  const { dispatch } = useAppState()
  const handleClick = () => {
    dispatch({ type: 'set post', payload: '0' })
  }

  const [closeEl, setMenuEl] = useState<null | HTMLElement>(null)
  const [isOpen, setOpen] = useState(false)
  const handleOpenClick = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(!isOpen)
    setMenuEl(e.currentTarget as HTMLElement)
  }
  const handleClose = () => {
    setMenuEl(null)
    setOpen(!isOpen)
  }

  return (
    <Box className={className}>
      <Box
        className={`rounded-lg ${'p-1'} ${className} `}
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row" sx={{ mt: 1 }}>
          {(friend || favorate || message) && (
            <Box sx={{ mr: 1.2 }}>
              <Avatar
                alt="0"
                uid={0}
                sx={{ width: 40, height: 40 }}
                variant="rounded"
              />
            </Box>
          )}
          <Box className="flex-1">
            <Stack
              justifyContent="space-between"
              direction="column"
              sx={{ minWidth: 0 }}
            >
              {(thread || favorate) && (
                <Stack direction="row">
                  <Link
                    to={`/user/0`}
                    color="#84aff7"
                    underline="hover"
                    className={'line-clamp-3'}
                    onClick={handleClick}
                  >
                    <Typography fontSize={16}>xxxxxx帖子名</Typography>
                  </Link>
                </Stack>
              )}
              {(friend || message) && (
                <Stack direction="row">
                  <Link
                    to={`/user/0`}
                    color="rgb(33, 117, 243)"
                    underline="hover"
                    className={'line-clamp-3'}
                    onClick={handleClick}
                  >
                    <Typography fontSize={16} fontWeight={500}>
                      你的好友
                    </Typography>
                  </Link>
                  <Typography
                    fontSize={16}
                    color="rgb(161, 173, 197)"
                    sx={{ ml: 1 }}
                  >
                    (我的备注)
                  </Typography>
                </Stack>
              )}
              <Typography className="pl-1" color="rgb(95, 97, 102)">
                balabalabala
              </Typography>
              {(thread || favorate || message) && (
                <Stack direction="row">
                  {favorate && (
                    <Typography
                      fontSize={12}
                      color="rgb(161, 173, 197)"
                      className="pr-2"
                    >
                      author
                    </Typography>
                  )}
                  <Typography fontSize={12} color="rgb(161, 173, 197)">
                    2023/01/01
                  </Typography>
                </Stack>
              )}

              {friend && (
                <Stack direction="row">
                  {basicIfo.map((item, index) => {
                    return (
                      <Box key={index}>
                        <Typography
                          className="pl-1"
                          fontSize="inherit"
                          color="#cbd2df"
                        >
                          {item.info}: 1
                        </Typography>
                      </Box>
                    )
                  })}
                </Stack>
              )}
            </Stack>
          </Box>
          {(friend || message) && (
            <Box>
              <ListItemButton
                aria-expanded={isOpen ? 'true' : undefined}
                onClick={handleOpenClick}
                style={{ color: 'rgb(33, 117, 243)' }}
              >
                <Typography fontSize={12}>管理</Typography>
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Menu open={isOpen} onClose={handleClose} anchorEl={closeEl}>
                <MenuItem>
                  <ListItemText>修改备注</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemText>删除</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {(thread || favorate) && (
            <Stack>
              <Stack
                direction="row"
                sx={{ m: 1, mr: 2 }}
                color="rgb(100, 103, 109)"
              >
                <Stack direction="row" sx={{ mr: 4 }}>
                  <WindowIcon />
                  <Typography>xx板块</Typography>
                </Stack>
                <Typography className="pl-1">查看：191</Typography>
                <Typography className="pl-1">回复：8</Typography>
              </Stack>
              <Typography
                sx={{ mt: 1, pr: 2 }}
                color="rgb(161, 173, 197)"
                align="right"
              >
                最新回复：xxx 2023/01/01
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
      <Divider variant="middle" style={{ backgroundColor: '#eae8ed' }} />
    </Box>
  )
}

export default Post
