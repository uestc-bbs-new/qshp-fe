import { redirect, useRouteError } from 'react-router-dom'

import { findPost, kPostPageSize } from '@/apis/thread'
import Error from '@/components/Error'
import { pages } from '@/utils/routes'

const Goto = async ({
  params,
  request,
}: {
  params: object
  request: Request
}) => {
  const p = params as { tidOrPid: string; pid?: string }
  let tid: string | undefined = p.tidOrPid
  let pid = p.pid
  if (!pid) {
    pid = p.tidOrPid
    tid = undefined
  }
  const url = new URL(request.url)
  const admin = url.searchParams.get('a')
  const result = await findPost(pid, tid, !!admin)
  const page = Math.ceil(result.position / kPostPageSize)
  const query = new URLSearchParams()
  if (page > 1) {
    query.set('page', page.toString())
  }
  if (admin) {
    query.set('a', admin)
  }
  return redirect(
    pages.thread(
      result.thread_id,
      query.size > 0 ? query : undefined,
      `post-${pid}`
    )
  )
}

export const GotoError = () => {
  const error = useRouteError()
  return <Error error={error} />
}

export default Goto
