import { Link as RouterLink } from 'react-router-dom'

import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'

type LinkProps = MuiLinkProps & {
  to?: string
}

const Link = ({ to, ...other }: LinkProps) => {
  return (
    <>
      {to ? (
        <MuiLink component={RouterLink} to={to} {...other} />
      ) : (
        <MuiLink {...other} />
      )}
    </>
  )
}

export default Link
