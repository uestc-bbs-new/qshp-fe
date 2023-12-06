import { useEffect, useState } from 'react'
import { useLocation, useMatches } from 'react-router-dom'

import siteRoot from './siteRoot'

const kIndexUrl = `${siteRoot}/forum.php`
export const useDiscuzLink = () => {
  const [legacyUrl, setLegacyUrl] = useState(kIndexUrl)
  const location = useLocation()
  const matches = useMatches()
  useEffect(() => {
    if (matches.length > 0) {
      const match = matches[matches.length - 1]
      switch (match.id) {
        case 'forum':
          setLegacyUrl(
            `${siteRoot}/forum.php?mod=forumdisplay&fid=${match.params.id}`
          )
          break
        case 'thread':
          setLegacyUrl(
            `${siteRoot}/forum.php?mod=viewthread&tid=${match.params.id}`
          )
          break
        default:
          setLegacyUrl(kIndexUrl)
      }
    }
  }, [location])
  return legacyUrl
}
