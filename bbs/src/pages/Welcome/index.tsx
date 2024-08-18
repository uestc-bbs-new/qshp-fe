import { css } from '@emotion/react'

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material'

import Link from '@/components/Link'
import { pages } from '@/utils/routes'

import CommonLayout from '../Continue/CommonLayout'

const articleCss = css({
  fontSize: 18,
  textAlign: 'justify',
  textWrap: 'pretty',
  marginTop: '1em',
  marginBottom: '2em',
  p: {
    margin: '0.5em 0',
    lineHeight: '1.75em',
  },
})

export const Welcome = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(15)
  useEffect(() => {
    let id: number | undefined = setInterval(() => {
      if (countdown == 0) {
        clearInterval(id)
        id = undefined
      } else {
        setCountdown(countdown - 1)
      }
    }, 1000)
    return () => clearInterval(id)
  })
  return (
    <Dialog open fullScreen>
      <DialogContent sx={{ p: 0 }}>
        <CommonLayout>
          <Box p={3}>
            <Typography variant="signinTitle">欢迎新用户！</Typography>
            <article css={articleCss}>
              <p>
                欢迎来到电子科技大学官方论坛——清水河畔！步入论坛前请阅读以下须知，有助于你快速熟悉河畔。
              </p>
              <p>
                1、河畔版块众多，请在发帖前寻找对应的版块发帖，既有助于更快解决你的问题，也有助于维持版面整洁。
              </p>
              <p>
                2、河畔可以灌水的版块只有
                <Link to={pages.forum(25)} target="_blank">
                  【水手之家】
                </Link>
                ，请勿在其他任何版块灌水。
              </p>
              <p>
                3、前往菜单栏中“论坛服务-水滴小任务”领取新手任务，阅读新手导航完成任务有水滴奖励！
              </p>
              <p>
                4、如在使用中遇到任何问题，可在【水手之家】版块
                <Link to={pages.post(25)} target="_blank">
                  发帖
                </Link>
                询问或随时向管理人员私信询问。
              </p>
              <p>
                其余事项请在进入河畔后根据提醒阅读
                <Link to={pages.thread(1821753)} target="_blank">
                  新手导航
                </Link>
                与
                <Link to={pages.thread(2142801)} target="_blank">
                  论坛总版规
                </Link>
                ，祝你在河畔玩得愉快！
              </p>
            </article>
            <Stack alignItems="center">
              <Button
                variant="contained"
                sx={{ fontSize: 18, minWidth: '12em', py: 1.5 }}
                disabled={countdown > 0}
                onClick={() => {
                  if (location.state && location.state.continue) {
                    navigate(location.state.continue, { replace: true })
                  } else {
                    window.location.href = '/'
                  }
                }}
              >
                {countdown > 0
                  ? `请阅读以上须知 (${countdown})`
                  : '进入清水河畔'}
              </Button>
            </Stack>
          </Box>
        </CommonLayout>
      </DialogContent>
    </Dialog>
  )
}
