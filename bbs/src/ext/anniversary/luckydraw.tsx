import { CSSObject, keyframes } from '@emotion/react'

import React from 'react'

import { Stack } from '@mui/material'

const kCircleSize = 420
const kBorderWidth = 10
const kDotSize = 12
const divInnerCommonCss = { borderRadius: '100%', height: '100%' }
const dotCommonCss: CSSObject = {
  borderRadius: '100%',
  width: kDotSize,
  height: kDotSize,
  backgroundColor: '#f9f8a8',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}
const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`
const kDiagonalCirclePos = 14.6447

export const LuckyDrawPlate = ({
  children,
  animate,
}: {
  children?: React.ReactNode
  animate?: boolean
}) => {
  return (
    <div
      css={{
        width: kCircleSize,
        maxWidth: '100%',
        margin: '32px auto',
      }}
    >
      <div css={{ paddingTop: '100%', position: 'relative' }}>
        <div
          css={{
            ...divInnerCommonCss,
            position: 'absolute',
            width: '100%',
            left: 0,
            top: 0,
            boxSizing: 'border-box',
            border: `${kBorderWidth}px solid #fa364d`,
            ...(animate && {
              animation: `${rotate} 1s linear infinite`,
            }),
          }}
        >
          <div
            css={{
              ...divInnerCommonCss,
              border: `${kBorderWidth}px solid #faa3b3`,
            }}
          >
            <div
              css={{
                ...divInnerCommonCss,
                background:
                  'repeating-conic-gradient(white 0 22.5deg, #f5db4d 22.5deg 45deg)',
              }}
            ></div>
          </div>
          <div css={dotCommonCss} style={{ left: 0, top: '50%' }} />
          <div css={dotCommonCss} style={{ left: '100%', top: '50%' }} />
          <div css={dotCommonCss} style={{ left: '50%', top: 0 }} />
          <div css={dotCommonCss} style={{ left: '50%', top: '100%' }} />
          <div
            css={dotCommonCss}
            style={{
              left: `${kDiagonalCirclePos}%`,
              top: `${kDiagonalCirclePos}%`,
            }}
          />
          <div
            css={dotCommonCss}
            style={{
              left: `${100 - kDiagonalCirclePos}%`,
              top: `${kDiagonalCirclePos}%`,
            }}
          />
          <div
            css={dotCommonCss}
            style={{
              left: `${kDiagonalCirclePos}%`,
              top: `${100 - kDiagonalCirclePos}%`,
            }}
          />
          <div
            css={dotCommonCss}
            style={{
              left: `${100 - kDiagonalCirclePos}%`,
              top: `${100 - kDiagonalCirclePos}%`,
            }}
          />
        </div>
        <Stack
          position="absolute"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
          left={0}
          top={0}
        >
          {children}
        </Stack>
      </div>
    </div>
  )
}
