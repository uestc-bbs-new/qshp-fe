import React from 'react'

import { Avatar as MuiAvatar, AvatarProps as MuiProps } from '@mui/material'

import defaultAvatar from '@/assets/avatar-default.png'
import { largeLink, middleLink, smallLink } from '@/utils/avatarLink'

const transform = (size: string | undefined, uid: number) => {
  if (size === 'small') {
    return smallLink(uid)
  } else if (size === 'large') {
    return largeLink(uid)
  }
  return middleLink(uid)
}

type AvatarProps = MuiProps & {
  uid: number
  size?: string
}
// set default avatar due to mui avatar fallbacks
const Avatar = ({ uid, size, alt, sx, ...other }: AvatarProps) => {
  let src = ''
  if (uid.toString().length === 6) {
    src = transform(size, uid)
  }
  return (
    <MuiAvatar alt={alt} src={src} sx={sx} {...other}>
      <MuiAvatar alt={alt} src={defaultAvatar} sx={sx} {...other} />
    </MuiAvatar>
  )
}

export default Avatar
