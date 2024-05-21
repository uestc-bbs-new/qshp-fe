import Vditor from 'vditor'
import 'vditor/dist/index.css'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import {
  Divider,
  Grid,
  IconButton,
  Menu,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'

import { Attachment } from '@/common/interfaces/base'
import { useAppState } from '@/states'

import {
  beforeGetMarkdown,
  kSmilyBasePath,
} from '../../../../markdown-renderer/src/renderer/renderer'
import { smilyData } from '../../../../markdown-renderer/src/renderer/smilyData'
import { VditorContext } from '../../../../markdown-renderer/src/renderer/types'
import { getPreviewThemeOptions } from '../../../../markdown-renderer/src/renderer/vditorConfig'
import options from './vditorConfig'

type EditorProps = IOptions & {
  initialValue?: string
  initialHtml?: string
  initialAttachments?: Attachment[]
  onKeyDown?: React.KeyboardEventHandler
  autoFocus?: boolean
}

export interface EditorHandle {
  get vditor(): Vditor | undefined
  get attachments(): Attachment[]
}

const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  {
    initialValue,
    initialHtml,
    initialAttachments,
    onKeyDown,
    autoFocus,
    ...other
  },
  ref
) {
  const { state } = useAppState()
  const vditorRef = useRef<HTMLDivElement>(null)
  const vditorContext = useRef<VditorContext>({
    attachments: initialAttachments || [],
  })
  const vditorInitialized = useRef(false)
  const theme = () => (state.theme === 'light' ? 'classic' : 'dark')
  const smilyAnchor = useRef<HTMLElement>()
  const [smilyOpen, setSmilyOpen] = useState(false)
  const closeSmily = () => setSmilyOpen(false)
  const [selectedSmilyKind, setSmilyKind] = useState(smilyData[0])
  useEffect(() => {
    ;(async () => {
      const Vditor = (await import('vditor')).default
      if (!vditorRef.current || vditorContext.current.vditor) {
        return
      }
      vditorContext.current.vditor = new Vditor(vditorRef.current, {
        after: () => {
          if (autoFocus) {
            vditorContext.current.vditor?.focus()
          }
          if (initialValue) {
            vditorContext.current.vditor?.insertValue(initialValue)
          }
          if (initialHtml) {
            vditorContext.current.vditor?.insertValue(
              vditorContext.current.vditor.html2md(initialHtml)
            )
          }
          vditorInitialized.current = true
        },
        beforeGetMarkdown,
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
          context: vditorContext.current,
        }),
        preview: {
          ...getPreviewThemeOptions(state.theme),
          // Disable preview action buttons which are useless in our bbs.
          actions: [],
        },
        ...other,
        theme: theme(),
      })
    })()
  }, [])
  useEffect(() => {
    if (vditorInitialized.current) {
      vditorContext.current.vditor?.setTheme(theme(), state.theme)
    }
  }, [state.theme, vditorContext.current.vditor])

  useImperativeHandle(
    ref,
    () => ({
      get vditor() {
        return vditorContext.current.vditor
      },
      get attachments() {
        return vditorContext.current.attachments
      },
    }),
    []
  )
  return (
    <>
      <div
        ref={vditorRef}
        className="vditor flex-1"
        css={{
          '@media (max-width: 520px)': {
            '.vditor-toolbar__item': {
              padding: 0,
            },
          },
        }}
        onKeyDown={onKeyDown}
      />
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
                    vditorContext.current.vditor?.insertValue(
                      ` ![${item.code || item.id}](s) `
                    )
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
})

export default Editor
