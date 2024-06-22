import { useSearchParams } from 'react-router-dom'

import { useActiveRoute } from './routes'
import siteRoot from './siteRoot'

const passthrough = (
  searchParams: URLSearchParams,
  params?: string[],
  prepend?: string
) => {
  const result: string[] = []
  searchParams.forEach((value, key) => {
    if (!params || params.includes(key)) {
      result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  })
  return (result.length ? prepend ?? '' : '') + result.join('&')
}

const kIndexUrl = `${siteRoot}/forum.php`
export const useDiscuzLink = () => {
  const match = useActiveRoute()
  const [searchParams] = useSearchParams()
  switch (match?.id) {
    case 'forum':
      return `${siteRoot}/forum.php?mod=forumdisplay&fid=${match.params.id}`
    case 'thread':
      return `${siteRoot}/forum.php?mod=viewthread&tid=${
        match.params.id
      }${passthrough(searchParams, ['page', 'authorid'], '&')}`
    case 'post':
      if (match.params.fid) {
        return `${siteRoot}/forum.php?mod=post&action=newthread&fid=${match.params.fid}`
      }
      return `${siteRoot}/forum.php?mod=misc&action=nav`
    case 'chat': {
      return `${siteRoot}/home.php?mod=space&do=pm${
        match.params.plid ? `&subop=view&plid=${match.params.plid}` : ``
      }`
    }
    case 'chat_user':
      return `${siteRoot}/home.php?mod=space&do=pm&subop=view&touid=${match.params.uid}`
    case 'posts':
      return `${siteRoot}/home.php?mod=space&do=notice&view=mypost`
    case 'system':
      return `${siteRoot}/home.php?mod=space&do=notice&view=system`
    case 'user':
    // fall through.
    case 'userByName': {
      let base = `${siteRoot}/home.php?mod=space&`
      if (match.params.uid) {
        base += 'uid=' + encodeURIComponent(match.params.uid)
      }
      if (match.params.username) {
        base += 'username=' + encodeURIComponent(match.params.username)
      }
      switch (match.params.subPage) {
        case 'threads':
        // fall through.
        case 'postcomments':
          base += 'do=thread&from=space'
          break
        case 'replies':
          base += 'do=reply&from=space'
          break
        case 'friends':
          base += 'do=friend&from=space'
          break
        case 'favorites':
          base += 'do=favorite'
          break
        case 'comments':
          base += 'do=wall'
          break
      }
      return `${base}${passthrough(searchParams, ['additional', 'page'], '&')}`
    }
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
