import React, { useEffect, useRef, useState } from 'react'

import {
  ClickAwayListener,
  Tooltip as MuiToolTip,
  TooltipProps,
  useTheme,
} from '@mui/material'

// the tooltip component children need to be wrapped in div
// https://mui.com/material-ui/react-tooltip/#custom-child-element
const Tooltip = ({ children, title, ...other }: TooltipProps) => {
  const theme = useTheme()
  return (
    <MuiToolTip
      title={title}
      {...other}
      PopperProps={{
        ...other.PopperProps,
        sx: {
          ...other.PopperProps?.sx,
          '& .MuiTooltip-tooltip': {
            backgroundColor: theme.palette.background.paper,
            padding: 0,
            maxWidth: 480,
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
            color: theme.palette.text.primary,
          },
        },
      }}
    >
      <div>{children}</div>
    </MuiToolTip>
  )
}

export const NotOpenOnDragTooltip = ({ ...props }: TooltipProps) => {
  const [open, setOpen] = useState(false)
  const timeout = useRef<number | null>(null)
  const touch = useRef<React.Touch | null>(null)
  const cleanup = () => {
    if (timeout.current != null) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }
  useEffect(() => cleanup, [])
  const kThreshold = 10
  const enterDelay = props.enterDelay ?? 100
  const leaveDelay = props.leaveDelay ?? 0
  const enterTouchDelay = props.enterTouchDelay ?? 700
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div
        onTouchStart={(e) => {
          cleanup()
          if (!open) {
            timeout.current = setTimeout(
              () => setOpen(true),
              enterTouchDelay + enterDelay
            )
          }
          if (e.touches[0]) {
            touch.current = e.touches[0]
          }
        }}
        onTouchMove={(e) => {
          const cur = e.touches[0]
          if (cur) {
            if (!touch.current) {
              touch.current = cur
            } else if (
              Math.abs(cur.pageX - touch.current.pageX) +
                Math.abs(cur.pageY - touch.current.pageY) >
              kThreshold
            ) {
              cleanup()
            }
          }
        }}
        onTouchEnd={() => {
          cleanup()
          touch.current = null
        }}
        onMouseEnter={() => {
          if (!open) {
            cleanup()
            setTimeout(() => setOpen(true), enterDelay)
          }
        }}
        onMouseLeave={() => {
          if (open) {
            cleanup()
            setTimeout(() => setOpen(false), leaveDelay)
          }
        }}
      >
        <Tooltip {...props} open={open} />
      </div>
    </ClickAwayListener>
  )
}

export default Tooltip
