import React from 'react'
import { Avatar as MuiAvatar, AvatarProps } from '@mui/material'

import { defaultLink } from '@/utils/avatarLink'

// set default avatar due to mui avatar fallbacks
const Avatar = ({ src, alt, sx }: AvatarProps) => {
  return (
    <MuiAvatar alt={alt} src={src} sx={sx}>
      <MuiAvatar alt={alt} src={defaultLink()} sx={sx} />
    </MuiAvatar>
  )
}

export default Avatar
