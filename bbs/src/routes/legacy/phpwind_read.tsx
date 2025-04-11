import { redirect } from 'react-router-dom'

import { PhpwindMaxPid, PhpwindReplyPidDelta } from '@/utils/phpwind'
import { pages } from '@/utils/routes'

const Loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const tid = parseInt(searchParams.get('tid') ?? '')
  if (!isNaN(tid) && tid) {
    const pidMatch = location.hash.match(/^#(\d+)$/)
    console.log(pidMatch, url.hash, request)
    if (pidMatch) {
      const pid = parseInt(pidMatch[1])
      if (pid && pid <= PhpwindMaxPid) {
        return redirect(pages.goto(pid + PhpwindReplyPidDelta))
      }
    }
    const page = parseInt(searchParams.get('page') ?? '')
    let query: URLSearchParams | undefined
    if (page) {
      query = new URLSearchParams()
      query.set('page', page.toString())
    }
    return redirect(pages.thread(tid, query))
  }
  return null
}

export default Loader
