import React from 'react'
import { NavigateFunction, matchRoutes } from 'react-router-dom'

import routes from '@/routes/routes'
import { StateAction } from '@/states/reducers/stateReducer'

export const onClickHandler = (
  e: React.MouseEvent<HTMLDivElement>,
  navigate: NavigateFunction,
  dispatch: React.Dispatch<StateAction>
) => {
  if (e.target instanceof HTMLImageElement) {
    const img = e.target
    if (img.classList.contains('post_attachment_image')) {
      dispatch({
        type: 'open dialog',
        payload: {
          kind: 'image',
          imageDetails: img.getAttribute('data-x-fullsize-path') || img.src,
        },
      })
    }
  }
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
    let processClick = false
    // Adapted from |shouldProcessLinkClick| of React Router, which is not
    // exported. See https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/dom.ts#L36.
    if (
      e.button == 0 &&
      (!a.target || a.target == '_self') &&
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    ) {
      processClick = true
    }
    const url = new URL(a.href)
    if (processClick && url.host == location.host) {
      const matches = matchRoutes(routes.current, url.pathname)
      if (matches && matches.every((item) => item.route.id != '404')) {
        navigate(url.pathname + url.search + url.hash)
        e.preventDefault()
        return
      }
    }

    if (url.host == 'wiki.stuhome.net') {
      // TODO(fangjue): Show some prompt and provide a link to
      // https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=1328284.
      e.preventDefault()
    }
  }
}
