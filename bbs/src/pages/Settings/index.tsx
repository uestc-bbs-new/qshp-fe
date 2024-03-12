import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

import Link from '@/components/Link'
import { SettingsSubPage, pages } from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'

import Blacklist from './Blacklist'
import PasswordSecurity from './PasswordSecurity'
import PrivacyFilter from './PrivacyFilter'
import Profile from './Profile'

type subPageItem = {
  id?: SettingsSubPage
  link?: string
  name: string
  external?: boolean
  Component?: React.ElementType
}

const listItems: subPageItem[] = [
  {
    id: 'profile',
    name: '个人资料',
    external: false,
    Component: Profile,
  },
  {
    link: `${siteRoot}/home.php?mod=spacecp&ac=credit`,
    name: '积分',
    external: true,
  },
  {
    link: `${siteRoot}/home.php?mod=spacecp&ac=usergroup`,
    name: '用户组',
    external: true,
  },
  {
    id: 'privacy',
    name: '隐私筛选',
    external: false,
    Component: PrivacyFilter,
  },
  {
    id: 'password',
    name: '密码安全',
    external: false,
    Component: PasswordSecurity,
  },
  {
    id: 'blacklist',
    name: '黑名单管理',
    external: false,
    Component: Blacklist,
  },
]

const Settings = () => {
  const id = useParams()['id'] || listItems.find((item) => !!item.id)?.id
  const initialIndex = listItems.findIndex((item) => id === item.id)
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  )

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    item: (typeof listItems)[number]
  ) => {
    if (!item.external) setSelectedIndex(index)
  }

  const SelectedComponent = listItems[selectedIndex].Component
  return (
    <Box sx={{ pr: 2, pt: 1, width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {listItems[selectedIndex].name}
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ height: 200, mr: 4 }}>
          <Paper
            elevation={3}
            sx={{ borderRadius: '10px', overflow: 'hidden' }}
          >
            <Box sx={{ width: 180 }}>
              <List disablePadding>
                {listItems.map((item, index) => (
                  <Link
                    to={
                      item.id == undefined ? item.link : pages.settings(item.id)
                    }
                    key={item.name}
                    underline="none"
                    color="inherit"
                    external={item.external}
                    target={item.external ? '_blank' : undefined}
                  >
                    <ListItemButton
                      key={index}
                      selected={selectedIndex === index}
                      onClick={(event) =>
                        handleListItemClick(event, index, item)
                      }
                      sx={{ height: 40 }}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </Link>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>
        {SelectedComponent && <SelectedComponent />}
      </Box>
    </Box>
  )
}
export default Settings
