import React from 'react'

import { AvatarProps, Avatar as MuiAvatar } from '@mui/material'

import { defaultLink } from '@/utils/avatarLink'

// set default avatar due to mui avatar fallbacks
const Avatar = ({ src, alt, sx, ...other }: AvatarProps) => {
  return (
    <MuiAvatar alt={alt} src={src} sx={sx} {...other}>
      <MuiAvatar alt={alt} src={defaultLink()} sx={sx} {...other} />
    </MuiAvatar>
  )
}

export default Avatar
