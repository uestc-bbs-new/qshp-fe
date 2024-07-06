import { css } from '@emotion/react'

import React from 'react'

import { Box, Stack, useTheme } from '@mui/material'

import logo from '../../assets/logo-signin.png'

const CommonLayout = ({ children }: { children?: React.ReactNode }) => {
  const dark = useTheme().palette.mode == 'dark'
  return (
    <Stack
      flexGrow={1}
      flexShrink={1}
      minHeight={1}
      sx={{
        flexDirection: 'row',
        '@media (max-width: 800px)': {
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        position="relative"
        overflow="hidden"
        flexShrink={0}
        sx={{
          alignItems: 'center',
          width: '57%',
          '@media (max-width: 1200px)': {
            width: '45%',
            paddingBottom: '10vh',
          },
          '@media (max-width: 800px)': {
            width: '100%',
            paddingBottom: '48px',
            paddingTop: '24px',
          },
        }}
      >
        <div
          css={{
            width: 2169,
            height: 2169,
            position: 'absolute',
            right: 0,
            bottom: 0,
            transform: `translate(0, ${(247 / 1080) * 100}vh)`,
            borderRadius: '100%',
            backgroundColor: dark ? '#154283' : '#71ABFF',
            '@media (max-width: 800px)': {
              left: 0,
              right: 'auto',
              transform: `translate(-50%, 0)`,
            },
          }}
        />
        <Box
          sx={{
            flexGrow: 1,
            '@media (max-width: 800px)': { flexGrow: 0, width: '24px' },
          }}
        />
        <Box flexGrow={0} flexShrink={0} style={{ position: 'relative' }}>
          <img
            src={logo}
            css={{
              opacity: dark ? 0.8 : undefined,
              '@media (max-width: 1200px)': {
                width: 200,
              },
              '@media (max-width: 800px)': {
                width: 100,
              },
              '@media (max-width: 520px)': {
                width: 72,
              },
            }}
          />
          <div
            css={css({
              fontSize: '60px',
              fontWeight: '900',
              margin: '0.5em 0',
              color: 'white',
              '@media (max-width: 1200px)': {
                fontSize: '40px',
              },
              '@media (max-width: 800px)': {
                fontSize: '32px',
              },
              '@media (max-width: 520px)': {
                fontSize: '28px',
              },
            })}
          >
            清水河畔
          </div>
          <div
            css={css({
              fontSize: '36px',
              fontWeight: '900',
              color: 'rgba(255, 255, 255, 0.56)',
              '@media (max-width: 1200px)': {
                fontSize: '24px',
              },
              '@media (max-width: 520px)': {
                fontSize: '18px',
              },
            })}
          >
            电子科技大学官方论坛
          </div>
        </Box>
        <Box
          sx={{
            flexGrow: 2,
            '@media (max-width: 1200px)': {
              flexGrow: 4,
            },
          }}
        />
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        flexShrink={1}
      >
        {children}
      </Stack>
    </Stack>
  )
}

export default CommonLayout
