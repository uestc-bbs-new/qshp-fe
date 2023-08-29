import { List, Box, Typography, useTheme, MenuItem, Stack } from '@mui/material'

import { Users } from '@/common/interfaces/response'
import Link from '../Link'
import Avatar from '../Avatar'

type resultUserProps = {
  status: string
  data: Users[]
  total: number
}
const SearchResultUser = ({
  status,
  data,
  total,
}: resultUserProps) => {
  const theme = useTheme()

  if (data.length == 0 || status == 'post')
    return <></>
  return (
    <Box
      className={`rounded-lg shadow-lg p-2`}
      style={{
        width: 300,
        position: 'absolute',
        top: 70,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <List>
        {data.map((item) => (
          <Box key={item.user_id}>
            <MenuItem >
              <Link
                to={`/thread/${item.username}`}
                color="inherit"
                underline="hover"
              >
                <Stack direction="row" >
                  <Avatar
                    className="mx-3"
                    uid={0}
                    sx={{ width: 32, height: 32 }}
                    variant="rounded"
                  />
                  <Typography color="text.secondary">{item.username}</Typography>
                </Stack>
              </Link>
            </MenuItem>
          </Box>
        ))}
      </List>
    </Box>
  )
}


export default SearchResultUser
