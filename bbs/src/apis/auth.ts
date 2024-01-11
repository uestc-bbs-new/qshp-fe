import { IdasSignInResult } from '@/common/interfaces/response'
import { authService, commonUrl } from '@/utils/request'

export type EphemeralAuthorization = {
  ticket: string
  ephemeral_authorization: string
}

export const signIn = (params: {
  username: string
  password: string
  keep_signed_in: boolean
  captcha_value?: string
  captcha_type?: string
}) => {
  return authService.post<string>(
    `${commonUrl}/auth/signin`,
    {
      username: params.username,
      password: params.password,
      keep_signed_in: params.keep_signed_in,
    },
    {
      headers: {
        ...(params.captcha_value && {
          'X-UESTC-BBS-Captcha': params.captcha_value,
        }),
        ...(params.captcha_type && {
          'X-UESTC-BBS-Captcha-Type': params.captcha_type,
        }),
      },
    }
  )
}

export const idasSignIn = (params: { continue: string; ticket: string }) => {
  return authService.post<IdasSignInResult>(
    `${commonUrl}/auth/signin/idas`,
    params
  )
}

export const idasChooseUser = (
  params: EphemeralAuthorization & {
    user_id: number
  }
) => {
  return authService.post<string>(`${commonUrl}/auth/signin/user`, params)
}

export const idasFreshman = (params: EphemeralAuthorization) => {
  return authService.post<string>(`${commonUrl}/auth/signin/freshman`, params)
}
export const register = (params: {
  ticket: string
  ephemeral_authorization: string
  username: string
  password: string
  email: string
  invitation?: string
}) => {
  return authService.post<string>(`${commonUrl}/auth/register`, params)
}

export const signOut = () => {
  return authService.post(`${commonUrl}/auth/signout`)
}
