import {
  ForumRestrictions,
  errForumRestrictedByCredits,
  errForumRestrictedByPay,
  errRateLimited,
} from '@/common/interfaces/errors'

const isForumRestrictions = (error: any) =>
  !!(
    error &&
    error.code &&
    [errForumRestrictedByCredits, errForumRestrictedByPay].includes(error.code)
  )

export const parseApiError = (error: any) => {
  let message = error?.message
  if (error?.type == 'http') {
    if (error?.status == 401) {
      message = '该页面需要登录后才能浏览。'
    } else {
      message = `HTTP ${error?.status} ${error?.statusText}`
    }
  } else if (error?.type == 'network') {
    message = '网络不畅，请稍后刷新重试'
  } else if (!message) {
    message = '系统错误'
  }

  let severity: 'error' | 'warning' = 'error'
  let title = '错误'
  let forumRestrictions: ForumRestrictions | undefined = undefined
  if (isForumRestrictions(error)) {
    severity = 'warning'
    title = '提示'
    forumRestrictions = error.details?.data
    if (forumRestrictions?.prompt) {
      message = forumRestrictions.prompt
    }
  }
  const result: {
    message: string
    severity: 'error' | 'warning'
    title: string
    forumRestrictions?: ForumRestrictions
    waitTimeout?: number
  } = { message, severity, title, forumRestrictions }
  if (
    error &&
    error.code == errRateLimited &&
    error.details?.data?.wait_timeout
  ) {
    result.waitTimeout = error.details.data.wait_timeout
  }
  console.log(result, error)
  return result
}
