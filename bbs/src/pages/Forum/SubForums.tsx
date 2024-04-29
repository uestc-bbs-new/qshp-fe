import { useState } from 'react'

import { ExpandLess, ExpandMore, ForumOutlined } from '@mui/icons-material'
import {
  Box,
  Collapse,
  Divider,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'

import { ForumStat } from '@/common/interfaces/forum'
import Card from '@/components/Card'
import Link from '@/components/Link'
import Separated from '@/components/Separated'
import { chineseTime } from '@/utils/dayjs'
import { unescapeSubject } from '@/utils/htmlEscape'
import { pages } from '@/utils/routes'

const SubForums = ({ children }: { children: ForumStat[] }) => {
  const [collapsed, setCollapsed] = useState(false)
  const theme = useTheme()

  return (
    <Card className="mt-8">
      <>
        <ListItemButton onClick={() => setCollapsed(!collapsed)}>
          <ListItemText>子版块</ListItemText>
          {collapsed ? <ExpandMore /> : <ExpandLess />}
        </ListItemButton>
        <Divider
          className="border-b-4 rounded-lg"
          style={{ borderBottomColor: theme.palette.primary.main }}
        />
        <Collapse in={!collapsed} timeout="auto">
          {!collapsed && (
            <Separated separator={<Divider />}>
              {children.map((child) => (
                <Box key={child.fid} className="p-4">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center">
                      <Link to={pages.forum(child.fid)}>
                        <Stack direction="row" alignItems="center">
                          <ForumOutlined fontSize="large" className="mr-4" />
                          <Typography variant="h6">{child.name}</Typography>
                        </Stack>
                      </Link>
                      {child.todayposts > 0 && (
                        <Typography className="ml-3" color="#F56C6C">
                          (<strong>{child.todayposts}</strong>)
                        </Typography>
                      )}
                    </Stack>
                    <Stack className="w-1/4">
                      {child.latest_thread ? (
                        <>
                          <Link
                            color="inherit"
                            to={pages.thread(child.latest_thread.thread_id)}
                          >
                            {unescapeSubject(
                              child.latest_thread.subject,
                              null,
                              true
                            )}
                          </Link>
                          <Stack direction="row">
                            <Typography className="mr-2">
                              {chineseTime(
                                child.latest_thread.lastpost_time * 1000
                              )}
                            </Typography>
                            <Link
                              color="inherit"
                              sx={{ textDecoration: 'none' }}
                              to={pages.user({
                                username: child.latest_thread.lastpost_author,
                              })}
                            >
                              {child.latest_thread.lastpost_author}
                            </Link>
                          </Stack>
                        </>
                      ) : (
                        <Typography>暂无</Typography>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Separated>
          )}
        </Collapse>
      </>
    </Card>
  )
}

export default SubForums
