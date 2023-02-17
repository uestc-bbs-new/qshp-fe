import React from 'react'
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'
import { useNavigate } from 'react-router-dom'

type LinkProps = MuiLinkProps & {
  to?: string
}

const Link = ({ to, ...other }: LinkProps) => {
  const navigate = useNavigate()

  const routerNavigate = () => {
    to && navigate(to)
  }

  return (
    <span onClick={routerNavigate}>
      <MuiLink {...other} />
    </span>
  )
}

export default Link
