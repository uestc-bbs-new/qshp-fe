import { Link as RouterLink, useSearchParams } from 'react-router-dom'

import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { useAppState } from '@/states'
import { State } from '@/states/reducers/stateReducer'
import { useActiveRoute } from '@/utils/routes'

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
      <StyledRouterLink key={1} to={`/thread/${state.activeThread.thread_id}`}>
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
      <StyledRouterLink key={index} to={`/forum/${forum.forum_id}`}>
        {forum.name}
      </StyledRouterLink>
    )
  ),
]
const search = (searchParams: URLSearchParams) => [
  <Typography key="1">搜索</Typography>,
  <Typography key="2">{searchParams.get('name')}</Typography>,
]

const Breadcrumbs = () => {
  const activeRoute = useActiveRoute()
  const [searchParams] = useSearchParams()
  const { state } = useAppState()

  return (
    <MuiBreadcrumbs>
      <StyledRouterLink color="inherit" to="/">
        首页
      </StyledRouterLink>
      {['forum', 'thread', 'post'].includes(activeRoute?.id || '') &&
        forum(state)}
      {activeRoute?.id == 'post' && <Typography>发帖</Typography>}
      {activeRoute?.id == 'thread' && thread(state)}
      {activeRoute?.id == 'search' && search(searchParams)}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
