import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'

type LinkProps = MuiLinkProps & {
  to?: string
  external?: boolean
}

const Link = ({ to, external, ...other }: LinkProps) => {
  if (!to) {
    return <MuiLink {...other} />
  }
  if (external) {
    return <MuiLink component="a" href={to} {...other} />
  }
  return <MuiLink component={RouterLink} to={to} {...other} />
}

export default Link
