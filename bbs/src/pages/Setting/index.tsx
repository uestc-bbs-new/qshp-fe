import { useState } from 'react'

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

const Setting = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
  }

  const listItems = ['个人资料', '积分', '用户组', '隐私筛选', '密码安全']

  return (
    <Box sx={{ px: 2, pt: 1 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {listItems[selectedIndex]}
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
        <Box sx={{ width: 180 }}>
          <List disablePadding>
            {listItems.map((item, index) => (
              <ListItemButton
                key={index}
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
                sx={{ height: 40 }}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  )
}
export default Setting
