import { useEffect, useRef } from 'react'

import { htmlspecialchars } from '../../../../markdown-renderer/src/utils/html'

export const useWatermark = ({ text }: { text: string }) => {
  const root = useRef<HTMLDivElement>()
  const bodyObserver = useRef<MutationObserver>()
  const watermarkObserver = useRef<MutationObserver>()

  const cleanup = () => {
    if (bodyObserver.current) {
      bodyObserver.current.disconnect()
      bodyObserver.current = undefined
    }
    if (watermarkObserver.current) {
      watermarkObserver.current.disconnect()
      watermarkObserver.current = undefined
    }
    if (root.current) {
      document.body.removeChild(root.current)
      root.current = undefined
    }
  }

  const createNew = () => {
    root.current = document.createElement('div')
    const div2 = document.createElement('div')
    const div3 = document.createElement('div')
    const div4 = document.createElement('div')
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="150">
        <text width="68" height="34" style="transform: rotate(15deg); transform-origin:0">
          <tspan x="0" y="28" alignment-baseline="middle" fill="rgba(130,136,148, 0.13)" style="font: normal 15px 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif">
            ${htmlspecialchars(text)}
          </tspan>
        </text>
      </svg>`.replace(/\n\s+/g, '')
    const img = `url(data:image/svg+xml;base64,${btoa(svg)})`
    div4.style.backgroundImage = `${img},${img}`
    div4.style.backgroundRepeat = 'repeat'
    div4.style.backgroundPosition = '0 0, 140px 75px'
    div4.style.position = 'fixed'
    div4.style.left = '0'
    div4.style.top = '0'
    div4.style.right = '0'
    div4.style.bottom = '0'
    div4.style.pointerEvents = 'none'
    root.current.appendChild(div2)
    div2.appendChild(div3)
    div3.appendChild(div4)
    document.body.appendChild(root.current)
  }

  const setup = () => {
    cleanup()
    createNew()
    bodyObserver.current = new MutationObserver((records) => {
      if (
        records.some(
          (record) =>
            record.removedNodes &&
            root.current &&
            [root.current].includes.call(record.removedNodes, root.current)
        )
      ) {
        createNew()
      }
    })
    bodyObserver.current.observe(document.body, { childList: true })
    watermarkObserver.current = new MutationObserver((records) => {
      setTimeout(setup, 1)
    })
    root.current &&
      watermarkObserver.current.observe(root.current, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      })
  }

  useEffect(() => {
    setup()
    return () => cleanup()
  }, [text])
}
