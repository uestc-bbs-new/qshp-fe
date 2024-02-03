import React, { forwardRef } from 'react'
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

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, external, ...other },
  ref
) {
  if (!to) {
    return <MuiLink {...other} ref={ref} />
  }
  if (external) {
    return <MuiLink component="a" href={to} {...other} ref={ref} />
  }
  return <MuiLink component={RouterLink} to={to} {...other} ref={ref} />
})

export const MenuItemLink = forwardRef<
  HTMLAnchorElement,
  MenuItemProps & LinkProps
>(function MenuItemLink(props, ref) {
  return <Link {...props} ref={ref} />
})

export default Link
