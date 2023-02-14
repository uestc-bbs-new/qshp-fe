import React, { useState } from 'react'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Toolbar,
  Skeleton,
  styled,
  Collapse,
  useTheme,
  Drawer,
} from '@mui/material'

import { Link } from 'react-router-dom'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useAppState } from '@/states'
import { Forum } from '@/common/interfaces/response'

type ForumData = {
  data: Forum
}

const menuFontStyle = { fontSize: '1rem', fontWeight: 'bold' }
const Ordinate = ({ data }: ForumData) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{/* <InboxIcon /> */}</ListItemIcon>
        <ListItemText
          primary={data.name}
          primaryTypographyProps={menuFontStyle}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {data?.forums?.map((item) => (
            <Link to={`/forum/${item.fid}`} key={item.name}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={menuFontStyle}
                />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Collapse>
    </>
  )
}

const Sections = ({ data }: { data: Forum[] }) => {
  return (
    <>
      {data.length === 0 ? (
        <List>
          <ListItem>
            <Skeleton className="w-full" height={32}></Skeleton>
          </ListItem>
          <ListItem>
            <Skeleton className="w-full" height={32}></Skeleton>
          </ListItem>
          <ListItem>
            <Skeleton className="w-full" height={32}></Skeleton>
          </ListItem>
        </List>
      ) : (
        <List>
          <Link to="/">
            <ListItemButton>
              <ListItemIcon>{/* <InboxIcon /> */}</ListItemIcon>
              <ListItemText
                primary="首页"
                primaryTypographyProps={menuFontStyle}
              />
            </ListItemButton>
          </Link>
          {data.map((item) => (
            <Ordinate key={item.name} data={item} />
          ))}
        </List>
      )}
    </>
  )
}

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

const LeftDrawer = () => {
  const theme = useTheme()
  const { state, dispatch } = useAppState()

  return (
    <Drawer
      variant="permanent"
      open={state.drawer}
      PaperProps={{
        sx: {
          background: '#e2e8f0',
          border: 'none',
          color: '#7082a7',
        },
      }}
    >
      <Box>
        <Toolbar />
        {/* {loading} */}
        <Sections data={state.navList} />
      </Box>
    </Drawer>
  )
}

export default LeftDrawer
