import Vditor from 'vditor'
import 'vditor/dist/index.css'

import React, { createRef, useEffect, useRef, useState } from 'react'

import {
  Divider,
  Grid,
  IconButton,
  Menu,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'

import { useAppState } from '@/states'

import { kSmilyBasePath } from '../RichText/renderer'
import { smilyData } from '../RichText/smilyData'
import { getPreviewThemeOptions } from '../RichText/vditorConfig'
import options from './vditorConfig'

type props = IOptions & {
  setVd: React.Dispatch<React.SetStateAction<Vditor | undefined>>
  onKeyDown?: React.KeyboardEventHandler
}

const Editor = ({ setVd, onKeyDown, ...other }: props) => {
  const { state } = useAppState()
  const vditorRef = createRef<HTMLDivElement>()
  const [vditor, setVditor] = useState<Vditor | undefined>(undefined)
  const theme = state.theme === 'light' ? undefined : 'dark'
  const smilyAnchor = useRef<HTMLElement>()
  const [smilyOpen, setSmilyOpen] = useState(false)
  const closeSmily = () => setSmilyOpen(false)
  const [selectedSmilyKind, setSmilyKind] = useState(smilyData[0])
  useEffect(() => {
    if (!vditorRef.current) {
      return
    }
    const vd = new Vditor(vditorRef.current, {
      after: () => {
        setVditor(vd)
        setVd(vd)
      },
      beforeGetMarkdown: (currentMode: string, el: HTMLElement) => {
        if (currentMode == 'wysiwyg') {
          const clone = el.cloneNode(true) as HTMLElement
          ;[].forEach.call(
            clone.querySelectorAll('img.post_smily'),
            (img: HTMLImageElement) => {
              img.src = img.getAttribute('data-x-original-src') || ''
              img.alt = img.getAttribute('data-x-original-alt') || ''
            }
          )
          return clone.innerHTML
        }
        return undefined
      },
      ...options({
        smilyToolbarItem: {
          name: 'smily',
          tip: '表情',
          icon: '<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path></svg>',
          click: (e) => {
            smilyAnchor.current = e.target as HTMLElement
            setSmilyOpen(true)
          },
        },
      }),
      preview: getPreviewThemeOptions(state.theme),
      ...other,
      theme,
    })
  }, [state.theme])

  useEffect(() => {
    if (vditor) {
      vditor.setTheme(theme || 'classic', theme)
    }
  }, [state.theme, vditor])
  return (
    <>
      <div ref={vditorRef} className="vditor flex-1" onKeyDown={onKeyDown} />
      <Menu
        anchorEl={smilyAnchor.current}
        open={smilyOpen}
        onClose={closeSmily}
      >
        <Stack maxWidth={640}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={selectedSmilyKind}
            onChange={(_, newValue) => setSmilyKind(newValue)}
          >
            {smilyData.map((smilyKind, index) => (
              <Tab key={index} label={smilyKind.name} value={smilyKind}></Tab>
            ))}
          </Tabs>
          <Divider />
          <Grid
            key={selectedSmilyKind.id}
            container
            maxHeight="300px"
            overflow="auto"
            flexShrink={1}
          >
            {selectedSmilyKind.items.map((item, index) => (
              <Grid key={index} item>
                <IconButton
                  onClick={() => {
                    vditor?.insertValue(` ![${item.code || item.id}](s) `)
                    closeSmily()
                  }}
                >
                  <img
                    src={`${kSmilyBasePath}/${selectedSmilyKind.path}/${item.path}`}
                    loading="lazy"
                    style={{
                      width: `${item.width}px`,
                      height: `${Math.floor(
                        (item.thumbnailHeight / item.thumbnailWidth) *
                          item.width
                      )}px`,
                    }}
                  />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Menu>
    </>
  )
}

export default Editor
