import { redirect } from 'react-router-dom'

import { pages } from '@/utils/routes'

const Loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  switch (searchParams.get('action')) {
    case 'show': {
      const uid = parseInt(searchParams.get('uid') ?? '')
      if (uid) {
        return redirect(pages.user({ uid }))
      }
      return null
    }
    default:
      return null
  }
}

export default Loader
