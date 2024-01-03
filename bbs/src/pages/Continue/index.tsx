import { useState } from 'react'
import {
  matchRoutes,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

import { idasChooseUser, idasSignIn } from '@/apis/common'
import { IdasSignInResult } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import routes from '@/routes/routes'
import { setAuthorizationHeader } from '@/utils/authHeader'

const kIdasOrigin = `https://bbs.uestc.edu.cn`
const kTicket = 'ticket'

const Continue = () => {
  const idasResult = useLoaderData() as IdasSignInResult & {
    ticket: string
    continue: string
  }
  if (typeof idasResult == 'string') {
    return <></>
  }

  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  const signIn = (user_id: number) => {
    setPending(true)
    idasChooseUser({
      user_id,
      ticket: idasResult.ticket,
      ephemeral_authorization: idasResult.ephemeral_authorization,
    })
      .then((authorization) => {
        setAuthorizationHeader(authorization)
        navigate(idasResult.continue, {
          replace: true,
        })
      })
      .catch(() => setPending(false))
  }

  return (
    <Dialog open>
      <DialogTitle>欢迎来到清水河畔！</DialogTitle>
      <DialogContent>
        {idasResult.users ? (
          <>
            <Typography>请选择您的账号完成登录：</Typography>
            <List>
              {idasResult.users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemButton
                    disabled={pending}
                    onClick={() => signIn(user.uid)}
                  >
                    <ListItemIcon>
                      <Avatar uid={user.uid} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography>{user.username}</Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>注册</>
        )}
      </DialogContent>
    </Dialog>
  )
}

const sanitizeContinuePath = (path: string | null) =>
  path && matchRoutes(routes.current, path) ? path : '/'

export const ContinueLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const ticket = searchParams.get(kTicket)
  if (!ticket) {
    throw 'Invalid signin'
  }
  const originalSearchParams = new URLSearchParams(searchParams)
  originalSearchParams.delete(kTicket)
  const continuePath = `${kIdasOrigin}${url.pathname}?${originalSearchParams}`
  if (ticket) {
    const result = await idasSignIn({ continue: continuePath, ticket })
    const path = sanitizeContinuePath(searchParams.get('path'))
    if (typeof result == 'string') {
      setAuthorizationHeader(result)
      return redirect(path)
    }
    return { ...result, ticket, continue: path }
  }
}

export default Continue
