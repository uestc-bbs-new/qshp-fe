import {
  Params,
  RouteObject,
  Link as RouterLink,
  matchRoutes,
  useLocation,
  useSearchParams,
} from 'react-router-dom'

import {
  MenuItem,
  Breadcrumbs as MuiBreadcrumbs,
  Typography as MuiTypography,
  Select,
  Skeleton,
  TypographyProps,
  useMediaQuery,
} from '@mui/material'
import { styled } from '@mui/material/styles'

import routes from '@/routes/routes'
import { useAppState } from '@/states'
import { State } from '@/states/reducers/stateReducer'
import { isPreviewRelease } from '@/utils/releaseMode'
import {
  mapMessagesRouteToMessageGroup,
  messagesSubPages,
  pages,
} from '@/utils/routes'
import siteRoot from '@/utils/siteRoot'

import { MenuItemLink } from '../Link'

const StyledRouterLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  color: theme.palette.primary.main,
}))

const TextSkeleton = ({ width }: { width: number }) => {
  const kUnitSize = 16
  return (
    <span>
      {[
        [...Array(Math.floor(width / kUnitSize))].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={kUnitSize}
            height="1em"
            sx={{ display: 'inline-block', verticalAlign: 'middle' }}
          />
        )),
      ]}
    </span>
  )
}

const Typography = ({ ...props }: TypographyProps) => (
  <MuiTypography component="span" {...props} />
)

const thread = (state: State) => {
  if (state.activeThread) {
    return (
      <StyledRouterLink key={1} to={pages.thread(state.activeThread.thread_id)}>
        {state.activeThread.subject}
      </StyledRouterLink>
    )
  }
  return <TextSkeleton width={225} />
}

const forum = (state: State) => {
  if (!state.activeForum) {
    return <TextSkeleton width={120} />
  }
  return state.activeForum.parents
    .slice()
    .reverse()
    .map((forum) => ({ fid: forum.fid, name: forum.name }))
    .concat([{ fid: state.activeForum.fid, name: state.activeForum.name }])
    .map((forum, index) =>
      index == 0 ? (
        <Typography key={index}>{forum.name}</Typography>
      ) : (
        <StyledRouterLink key={index} to={pages.forum(forum.fid)}>
          {forum.name}
        </StyledRouterLink>
      )
    )
}
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

const user = (state: State) => [
  <StyledRouterLink key="1" to={pages.user()}>
    个人空间
  </StyledRouterLink>,
  ...(state.userBreadcumbs?.username && !state.userBreadcumbs?.self
    ? [
        <StyledRouterLink
          key="2"
          to={pages.user({ uid: state.userBreadcumbs?.uid })}
        >
          {state.userBreadcumbs.username}
        </StyledRouterLink>,
      ]
    : []),
  <Typography key="3">
    {state.userBreadcumbs?.username ? (
      <>{state.userBreadcumbs.subPageTitle}</>
    ) : (
      <TextSkeleton width={160} />
    )}
  </Typography>,
]

const messages = (route?: RouteObject, narrowView?: boolean) => {
  const pageId = mapMessagesRouteToMessageGroup(route)
  return [
    <Typography key="1">消息</Typography>,
    narrowView ? (
      <Select
        key="2"
        size="small"
        sx={{ '.MuiSelect-select': { minHeight: 0, py: 0.5 } }}
        value={pageId}
      >
        {messagesSubPages.map((item) => (
          <MenuItem
            key={item.id}
            component={MenuItemLink}
            to={
              isPreviewRelease && item.id == 'chat'
                ? `${siteRoot}/home.php?mod=space&do=pm`
                : pages.messages(item.id)
            }
            external={isPreviewRelease && item.id == 'chat'}
            target={
              isPreviewRelease && item.id == 'chat' ? '_blank' : undefined
            }
            value={item.id}
          >
            {item.text}
          </MenuItem>
        ))}
      </Select>
    ) : (
      <Typography key="2">
        {messagesSubPages.find((item) => item.id == pageId)?.text}
      </Typography>
    ),
  ]
}

const Breadcrumbs = () => {
  const [searchParams] = useSearchParams()
  const { state } = useAppState()

  const location = useLocation()
  const matches = matchRoutes(routes.current, location)
  const activeMatch = matches?.length ? matches[matches.length - 1] : undefined
  const activeRoute = activeMatch?.route
  const narrowView = useMediaQuery('(max-width: 800px)')

  if (activeRoute?.id == 'index' || activeRoute?.id == '404') {
    return <></>
  }

  return (
    <MuiBreadcrumbs
      sx={{
        '.MuiBreadcrumbs-ol, .MuiBreadcrumbs-li': {
          display: 'inline',
          verticalAlign: 'middle',
        },
        '.MuiBreadcrumbs-separator': {
          display: 'inline-block',
          verticalAlign: 'middle',
        },
      }}
    >
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
      {(activeRoute?.id == 'user' || activeRoute?.id == 'userByName') &&
        user(state)}
      {[
        'messages_chat',
        'messages_chat_user',
        'messages_posts',
        'messages_system',
      ].includes(activeRoute?.id ?? '') && messages(activeRoute, narrowView)}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
