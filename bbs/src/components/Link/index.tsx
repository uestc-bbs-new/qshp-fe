import React from 'react'
import {
  LinkProps as ReactLinkProps,
  Link as RouterLink,
  To,
} from 'react-router-dom'

import {
  MenuItemProps,
  Link as MuiLink,
  LinkProps as MuiLinkProps,
} from '@mui/material'

export type LinkProps = MuiLinkProps &
  Omit<ReactLinkProps, 'to'> & {
    external?: boolean
    to?: To
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
