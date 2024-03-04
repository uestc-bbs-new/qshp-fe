import { useActiveRoute } from '@/utils/routes'

import Breadcrumbs from '../Breadcurmbs'

const Header = () => {
  const route = useActiveRoute()
  return <>{route?.id !== 'index' && route?.id != '404' && <Breadcrumbs />}</>
}

export default Header
