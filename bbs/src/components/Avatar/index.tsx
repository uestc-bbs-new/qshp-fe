import { Avatar as MuiAvatar, AvatarProps as MuiProps } from '@mui/material'

import anonymousAvatar from '@/assets/avatar-anonymous.png'
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
  size?: number
  imageSize?: string
}
// set default avatar due to mui avatar fallbacks
const Avatar = ({ uid, size, imageSize, alt, sx, ...other }: AvatarProps) => {
  const src = uid ? transform(imageSize, uid) : anonymousAvatar
  const commonProps = {
    alt,
    sx: { ...(size && { width: size, height: size }), ...sx },
  }
  return (
    <MuiAvatar
      key={uid}
      imgProps={{ loading: 'lazy' }}
      src={src}
      {...commonProps}
      variant="rounded"
      {...other}
    >
      <MuiAvatar src={defaultAvatar} {...commonProps} {...other} />
    </MuiAvatar>
  )
}

export default Avatar
