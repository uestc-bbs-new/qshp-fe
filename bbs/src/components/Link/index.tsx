import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import {
  MenuItemProps,
  Link as MuiLink,
  LinkProps as MuiLinkProps,
} from '@mui/material'

export type LinkProps = MuiLinkProps & {
  to?: string
  preventScrollReset?: boolean
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

export const MenuItemLink = (props: MenuItemProps & LinkProps) => (
  <Link {...props} />
)

export default Link
