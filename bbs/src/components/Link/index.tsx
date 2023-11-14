import { useNavigate } from 'react-router-dom'

import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'
import { MouseEvent, MouseEventHandler, SyntheticEvent } from 'react'

type LinkProps = MuiLinkProps & {
  to?: string
}

const Link = ({ to, ...other }: LinkProps) => {
  const navigate = useNavigate()

  const routerNavigate = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
    if (to) {
      navigate(to)
      e.preventDefault()
    }
  }

  return (
    <span onClick={routerNavigate} className="cursor-pointer">
      <MuiLink href={to} {...other} />
    </span>
  )
}

export default Link
