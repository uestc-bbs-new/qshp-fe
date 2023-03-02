import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material'

import Link from '../Link'

const Breadcrumbs = () => {
  return (
    <MuiBreadcrumbs>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
