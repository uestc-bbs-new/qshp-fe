import { useEffect, useState } from 'react'
import { useLocation, useMatches } from 'react-router-dom'

const kIndexUrl = '/forum.php'
export const useDiscuzLink = () => {
  const [legacyUrl, setLegacyUrl] = useState(kIndexUrl)
  const location = useLocation()
  const matches = useMatches()
  useEffect(() => {
    if (matches.length > 0) {
      const match = matches[matches.length - 1]
      switch (match.id) {
        case 'forum':
          setLegacyUrl(`/forum.php?mod=forumdisplay&fid=${match.params.id}`)
          break
        case 'thread':
          setLegacyUrl(`/forum.php?mod=viewthread&tid=${match.params.id}`)
          break
        default:
          setLegacyUrl(kIndexUrl)
      }
    }
  }, [location])
  return legacyUrl
}
