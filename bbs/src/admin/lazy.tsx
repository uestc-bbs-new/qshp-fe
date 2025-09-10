import Index from '.'
import Freshman from '../ext/freshman/admin'
import Advanced from './advanced'
import Layout from './base/Layout'
import Announcement from './global/Announcement'
import Toplist from './global/Toplist'

export const LayoutRoute = { element: <Layout /> }
export const IndexRoute = { element: <Index /> }
export const AnnouncementRoute = { element: <Announcement /> }
export const ToplistRoute = { element: <Toplist /> }
export const AdvancedRoute = { element: <Advanced /> }

export const xFreshmanRoute = { element: <Freshman /> }
