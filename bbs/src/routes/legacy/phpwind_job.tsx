import { redirect } from 'react-router-dom'

import { PhpwindMaxPid, PhpwindReplyPidDelta } from '@/utils/phpwind'
import { pages } from '@/utils/routes'

const Loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  switch (searchParams.get('action')) {
    case 'topost': {
      const tid = parseInt(searchParams.get('tid') ?? '')
      if (searchParams.get('pid') == 'tpc' && tid) {
        return redirect(pages.thread(tid))
      }
      const pid = parseInt(searchParams.get('pid') ?? '')
      if (pid && pid <= PhpwindMaxPid) {
        return redirect(pages.goto(pid + PhpwindReplyPidDelta))
      }
      return null
    }
    default:
      return null
  }
}

export default Loader
