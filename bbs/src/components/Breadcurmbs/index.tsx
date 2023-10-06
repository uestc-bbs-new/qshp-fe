import { Link as RouterLink, useLocation } from 'react-router-dom'

import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledRouterLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}))

const Breadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <MuiBreadcrumbs>
      <StyledRouterLink color="inherit" to="/">
        Home
      </StyledRouterLink>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const isSecondLast = index === pathnames.length - 2

        return isLast ? (
          <span key={routeTo}>{name}</span>
        ) : isSecondLast ? (
          <span key={routeTo}>{name}</span>
        ) : (
          <StyledRouterLink key={routeTo} color="inherit" to={routeTo}>
            {name}
          </StyledRouterLink>
        )
      })}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
