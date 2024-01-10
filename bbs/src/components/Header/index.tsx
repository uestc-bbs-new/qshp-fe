import { useActiveRoute } from '@/utils/routes'

import Breadcrumbs from '../Breadcurmbs'

const Header = () => {
  const route = useActiveRoute()
  return <>{route?.id !== 'index' && <Breadcrumbs />}</>
}

export default Header
