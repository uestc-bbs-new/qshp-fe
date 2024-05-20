import {
  Params,
  Link as RouterLink,
  matchRoutes,
  useLocation,
  useSearchParams,
} from 'react-router-dom'

import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import routes from '@/routes/routes'
import { useAppState } from '@/states'
import { State } from '@/states/reducers/stateReducer'
import { pages } from '@/utils/routes'

const StyledRouterLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  color: theme.palette.primary.main,
}))

const thread = (state: State) => {
  if (state.activeThread) {
    return (
      <StyledRouterLink key={1} to={pages.thread(state.activeThread.thread_id)}>
        {state.activeThread.subject}
      </StyledRouterLink>
    )
  }
  return []
}

const forum = (state: State) => [
  state.forumBreadcumbs.map((forum, index) =>
    forum.top ? (
      <Typography key={index}>{forum.name}</Typography>
    ) : (
      <StyledRouterLink key={index} to={pages.forum(forum.forum_id)}>
        {forum.name}
      </StyledRouterLink>
    )
  ),
]
const search = (routeParams: Params<string>, searchParams: URLSearchParams) => {
  const typeText = { thread: '帖子', user: '用户' }[
    routeParams['type'] || 'thread'
  ]
  return [
    <Typography key="1">搜索</Typography>,
    ...(typeText ? [<Typography key="2">{typeText}</Typography>] : []),
    <Typography key="3">{searchParams.get('q')}</Typography>,
  ]
}

const Breadcrumbs = () => {
  const [searchParams] = useSearchParams()
  const { state } = useAppState()

  const location = useLocation()
  const matches = matchRoutes(routes.current, location)
  const activeMatch = matches?.length ? matches[matches.length - 1] : undefined
  const activeRoute = activeMatch?.route

  if (activeRoute?.id == 'index' || activeRoute?.id == '404') {
    return <></>
  }

  return (
    <MuiBreadcrumbs>
      <StyledRouterLink color="inherit" to={pages.index()}>
        首页
      </StyledRouterLink>
      {['forum', 'thread', 'post'].includes(activeRoute?.id || '') &&
        forum(state)}
      {activeRoute?.id == 'post' && <Typography>发帖</Typography>}
      {activeRoute?.id == 'thread' && thread(state)}
      {activeRoute?.id == 'search' &&
        activeMatch &&
        search(activeMatch.params, searchParams)}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
