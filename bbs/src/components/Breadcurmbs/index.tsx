import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material'

import Link from '../Link'

const Breadcrumbs = () => {
  return (
    <MuiBreadcrumbs>
      <Link underline="none" to="/" color="inherit">
        Home
      </Link>
      <Link underline="none" to="/about" color="inherit">
        About
      </Link>
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
