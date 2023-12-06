import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

import Link from '@/components/Link'
import siteRoot from '@/utils/siteRoot'

import PasswordSecurity from './PasswordSecurity'
import PrivacyFilter from './PrivacyFilter'
import Profile from './Profile'

const listItems = [
  {
    link: '/setting/profile',
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
    link: '/setting/privacy',
    name: '隐私筛选',
    external: false,
    Component: PrivacyFilter,
  },
  {
    link: '/setting/password',
    name: '密码安全',
    external: false,
    Component: PasswordSecurity,
  },
]

const Setting = () => {
  const location = useLocation()
  const [selectedIndex, setSelectedIndex] = useState(
    listItems.findIndex((item) => location.pathname.endsWith(item.link))
  )

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
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
                    to={item.link}
                    key={item.name}
                    underline="none"
                    color="inherit"
                    external={item.external}
                    target={item.external ? '_blank' : undefined}
                  >
                    <ListItemButton
                      key={index}
                      selected={selectedIndex === index}
                      onClick={(event) => handleListItemClick(event, index)}
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
export default Setting
