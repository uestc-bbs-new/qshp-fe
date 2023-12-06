import { useActiveRoute } from './routes'
import siteRoot from './siteRoot'

const kIndexUrl = `${siteRoot}/forum.php`
export const useDiscuzLink = () => {
  const match = useActiveRoute()
  switch (match?.id) {
    case 'forum':
      return `${siteRoot}/forum.php?mod=forumdisplay&fid=${match.params.id}`
    case 'thread':
      return `${siteRoot}/forum.php?mod=viewthread&tid=${match.params.id}`
    default:
      return kIndexUrl
  }
}
