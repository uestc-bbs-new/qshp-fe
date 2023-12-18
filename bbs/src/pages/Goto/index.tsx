import { redirect } from 'react-router-dom'

import { findPost, kPostPageSize } from '@/apis/thread'

const Goto = async ({
  params,
}: {
  params: { tidOrPid: string; pid: string }
}) => {
  let tid: string | undefined = params.tidOrPid
  let pid = params.pid
  if (!pid) {
    pid = params.tidOrPid
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
