import { css } from '@emotion/react'

import { Box } from '@mui/material'

import { UserGroupDetails } from '@/common/interfaces/response'
import siteRoot from '@/utils/siteRoot'

const UserGroupIcon = ({
  user,
  maxHeight,
}: {
  user?: UserGroupDetails
  maxHeight?: string | number
}) => (
  <>
    {user?.group_icon && (
      <Box>
        <img
          src={`${siteRoot}/${user.group_icon}`}
          css={css({
            display: 'block',
            maxWidth: '100%',
            maxHeight,
          })}
        />
      </Box>
    )}
  </>
)

export default UserGroupIcon
