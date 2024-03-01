import { css } from '@emotion/react'

import { Box, Stack, Typography } from '@mui/material'

import { PostFloor } from '@/common/interfaces/response'
import { ReplyCredit } from '@/components/icons/ReplyCredit'

export const ReplyCreditBadge = ({ post }: { post: PostFloor }) => (
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
        <Typography variant="replyCredit" ml={1}>
          回帖奖励 +{post.reply_credit_amount} {post.reply_credit_name}
        </Typography>
      </Stack>
    </Box>
  </Stack>
)
