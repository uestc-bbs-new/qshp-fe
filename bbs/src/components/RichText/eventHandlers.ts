import { NavigateFunction, matchRoutes } from 'react-router-dom'

import routes from '@/routes/routes'

export const onClickHandler = (
  e: React.MouseEvent<HTMLDivElement>,
  navigate: NavigateFunction
) => {
  let a: HTMLElement | null | EventTarget = e.target
  while (
    a &&
    a != e.currentTarget &&
    !(a instanceof HTMLAnchorElement) &&
    a instanceof Node
  ) {
    a = a.parentElement
  }
  if (a && a instanceof HTMLAnchorElement && a.href) {
    const url = new URL(a.href)
    if (
      url.host == location.host &&
      matchRoutes(routes.current, url.pathname)
    ) {
      navigate(url.pathname + url.search + url.hash)
      e.preventDefault()
    } else if (url.host == 'wiki.stuhome.net') {
      // TODO(fangjue): Show some prompt and provide a link to
      // https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=1328284.
      e.preventDefault()
    }
  }
}
