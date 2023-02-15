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
  Drawer,
  Collapse,
  Link,
  Typography,
} from '@mui/material'

import { ExpandLess, ExpandMore } from '@mui/icons-material'

import { useAppState } from '@/states'
import { Forum } from '@/common/interfaces/response'

type ForumData = {
  data: Forum
}

const Ordinate = ({ data }: ForumData) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{/* <InboxIcon /> */}</ListItemIcon>
        <ListItemText>
          <Typography color="inherit" className="font-bold">
            {data.name}
          </Typography>
        </ListItemText>
        {open ? (
          <ExpandLess fontSize="inherit" />
        ) : (
          <ExpandMore fontSize="inherit" />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {data?.forums?.map((item) => (
            <Link
              href={`/forum/${item.fid}`}
              key={item.name}
              underline="none"
              color="inherit"
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>{/* <StarBorder /> */}</ListItemIcon>
                <ListItemText>
                  <Typography color="inherit" className="font-bold">
                    {item.name}
                  </Typography>
                </ListItemText>
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
        <List style={{ color: '#7082a7' }}>
          <Link href="/" underline="none" color="inherit">
            <ListItemButton>
              <ListItemIcon>{/* <InboxIcon /> */}</ListItemIcon>
              <ListItemText>
                <Typography color="inherit" className="font-bold">
                  首页
                </Typography>
              </ListItemText>
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

const NavLinks = () => {
  const { state } = useAppState()

  return (
    <Box>
      <Toolbar />
      <Sections data={state.navList} />
    </Box>
  )
}

// use different drawer variant due to the media
const LeftDrawer = ({ width }: { width: number }) => {
  const { state } = useAppState()

  return (
    <>
      <Drawer
        variant="temporary"
        open={state.drawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
      >
        <NavLinks />
      </Drawer>
      <Drawer
        variant="persistent"
        open={state.drawer}
        PaperProps={{
          sx: {
            border: 'none',
          },
        }}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
      >
        <NavLinks />
      </Drawer>
    </>
  )
}

export default LeftDrawer
