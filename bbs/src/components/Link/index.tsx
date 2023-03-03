import { useNavigate } from 'react-router-dom'

import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'

type LinkProps = MuiLinkProps & {
  to?: string
}

const Link = ({ to, ...other }: LinkProps) => {
  const navigate = useNavigate()

  const routerNavigate = () => {
    to && navigate(to)
  }

  return (
    <span onClick={routerNavigate} className="cursor-pointer">
      <MuiLink {...other} />
    </span>
  )
}

export default Link
