import { css } from '@emotion/react'

import React from 'react'

import { Box, Stack } from '@mui/material'

import { ReplyCredit } from '@/components/icons/ReplyCredit'

export const ReplyAwardBadge = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <Stack alignItems="flex-start" mb={0.75}>
    <Box position="relative" left={-26} width={240}>
      <svg
        css={css({ display: 'block' })}
        viewBox="0 0 320 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M296.9,23.5L320,43H10V3h310L296.9,23.5z"
          fill="#FBACA3"
          fillRule="evenodd"
        />
        <path
          d="M9.8,46.1V33.9L0,40L9.8,46.1z"
          fill="#DF6A6A"
          fillRule="evenodd"
        />
        <path
          d="M296.2,20.5L320,40H0L0,0l320,0L296.2,20.5z"
          fill="#FFF4DD"
          fillRule="evenodd"
        />
      </svg>
      <Stack
        position="absolute"
        left="0"
        right="0"
        top="0"
        bottom="0"
        direction="row"
        justifyContent="center"
        alignItems="center"
        pb={0.35}
        pr={1}
      >
        <ReplyCredit css={css({ width: 16 })} />
        {children}
      </Stack>
    </Box>
  </Stack>
)

const kReplyAwardHeight = 56

export const ReplyAwardFloorLeft = ({
  shortName,
  promptText,
  rightBadge,
  topBottom,
}: {
  shortName: string
  promptText: React.ReactNode
  rightBadge?: React.ReactNode
  topBottom?: boolean
}) => (
  <Stack
    direction="row"
    justifyContent={
      rightBadge != undefined && topBottom ? 'space-between' : 'center'
    }
    alignItems="center"
    borderBottom={topBottom ? undefined : '5px solid #A3B8DC'}
    height={topBottom ? undefined : kReplyAwardHeight}
    px={topBottom ? 2 : undefined}
    pt={topBottom ? 1.5 : undefined}
  >
    <Stack direction="row" justifyContent="center" alignItems="center">
      <div
        css={css({
          backgroundColor: '#679EF8',
          border: '2px solid #196BE7',
          color: 'white',
          fontSize: '14px',
          textAlign: 'center',
          width: '20px',
          lineHeight: '20px',
          boxSizing: 'content-box',
        })}
      >
        {shortName}
      </div>
      {promptText}
    </Stack>
    {rightBadge}
  </Stack>
)

export const ReplyAwardFloorRight = ({
  children,
  topBottom,
}: {
  children: React.ReactNode
  topBottom?: boolean
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    borderBottom={`${topBottom ? 2 : 5}px solid #E0E0E0`}
    height={topBottom ? undefined : kReplyAwardHeight}
    px={2}
    py={topBottom ? 1 : undefined}
  >
    {children}
  </Stack>
)
