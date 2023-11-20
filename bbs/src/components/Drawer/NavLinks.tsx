import React, { useState } from 'react'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Toolbar,
  Typography,
} from '@mui/material'

import { Forum } from '@/common/interfaces/response'
import Link from '@/components/Link'
import { useAppState } from '@/states'

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
          {data?.children
            ?.filter((item: any) => item.fid !== 0)
            .map((item) => (
              <Link
                to={`/forum/${item.fid}`}
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
      {!data || data.length === 0 ? (
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
          <Link to="/" underline="none" color="inherit">
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

export default NavLinks
