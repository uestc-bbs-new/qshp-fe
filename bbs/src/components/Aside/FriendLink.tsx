import { InsertLink } from '@mui/icons-material'
import { Box, Typography, useTheme } from '@mui/material'

import Link from '../Link'

const qshpLogoImg = new URL(
  `../../assets/title.ico`,
  import.meta.url
).href.toString()
const uesteImg = new URL(
  `../../assets/uestc.png`,
  import.meta.url
).href.toString()
const starStudioImg = new URL(
  '../../assets/star-studio.png',
  import.meta.url
).href.toString()

const FriendLink = () => {
  const theme = useTheme()
  return (
    <>
      <Box alignItems={'center'} className="flex mt-8 mb-4">
        <InsertLink />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 'bold',
            color: theme.palette.text.secondary,
          }}
        >
          友情链接
        </Typography>
      </Box>
      <Link
        to={'https://bbs.uestc.edu.cn/'}
        external={true}
        target={'_blank'}
        underline="none"
      >
        <Box display="flex" alignItems={'center'} className="mb-3">
          <img src={qshpLogoImg} alt="清水河畔" className="w-5 h-5 mr-1" />
          <Typography
            sx={{ fontSize: 13, color: theme.palette.text.secondary }}
          >
            清水河畔-电子科技大学官方论坛
          </Typography>
        </Box>
      </Link>
      <Link
        to={'https://www.uestc.edu.cn/'}
        external={true}
        target={'_blank'}
        underline="none"
      >
        <img src={uesteImg} alt="电子科技大学" style={{ width: '100%' }} />
      </Link>
      <Link
        to={'https://starstudio.uestc.edu.cn/pc.html'}
        external={true}
        target={'_blank'}
        underline="none"
      >
        <img src={starStudioImg} alt="星辰工作室" style={{ width: '70%' }} />
      </Link>
      <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
        1998-2024 StarStudio
      </Typography>
    </>
  )
}

export default FriendLink
