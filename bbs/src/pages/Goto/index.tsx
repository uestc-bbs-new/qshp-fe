import { redirect } from 'react-router-dom'

import { findPost, kPostPageSize } from '@/apis/thread'
import { pages } from '@/utils/routes'

const Goto = async ({ params }: { params: object }) => {
  const p = params as { tidOrPid: string; pid?: string }
  let tid: string | undefined = p.tidOrPid
  let pid = p.pid
  if (!pid) {
    pid = p.tidOrPid
    tid = undefined
  }
  const result = await findPost(pid, tid)
  const page = Math.ceil(result.position / kPostPageSize)
  return redirect(
    pages.thread(
      result.thread_id,
      page > 1
        ? new URLSearchParams({
            page: page.toString(),
          })
        : undefined,
      `post-${pid}`
    )
  )
}

export default Goto
