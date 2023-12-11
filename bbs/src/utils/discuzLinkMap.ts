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
    case 'post':
      if (match.params.fid) {
        return `${siteRoot}/forum.php?mod=post&action=newthread&fid=${match.params.fid}`
      }
      return `${siteRoot}/forum.php?mod=misc&action=nav`
    case `setting`:
      switch (match.params.id) {
        case 'privacy':
          return `${siteRoot}/home.php?mod=spacecp&ac=privacy`
        case 'password':
          return `${siteRoot}/home.php?mod=spacecp&ac=profile&op=password`
        default:
          return `${siteRoot}/home.php?mod=spacecp`
      }
    default:
      return kIndexUrl
  }
}
