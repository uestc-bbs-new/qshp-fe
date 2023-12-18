import { redirect } from 'react-router-dom'

import { findPost, kPostPageSize } from '@/apis/thread'

const Goto = async ({ params }: { params: object }) => {
  const p = params as { tidOrPid: string; pid?: string }
  let tid: string | undefined = p.tidOrPid
  let pid = p.pid
  if (!pid) {
    pid = p.tidOrPid
    tid = undefined
  }
  const result = await findPost(pid, tid)
  return redirect(
    `/thread/${result.thread_id}?page=${Math.ceil(
      result.position / kPostPageSize
    )}#post-${pid}`
  )
}

export default Goto
