import { Box } from '@mui/material'

import digest from '@/assets/stamps/digest.png'
import excellent from '@/assets/stamps/excellent.png'
import hot from '@/assets/stamps/hot.png'
import pinned from '@/assets/stamps/pinned.png'
import recommended from '@/assets/stamps/recommended.png'

const Stamp = ({
  text,
  color,
  img,
  textCss,
}: {
  text: string
  color: string
  img: string
  textCss?: object
}) => (
  <Box
    position="absolute"
    right={0}
    top={0}
    zIndex={1}
    sx={{ pointerEvents: 'none', transform: 'translate(-50%, -50%)' }}
  >
    <div
      css={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30,
        textAlign: 'center',
        color: color,
        fontSize: 42,
        fontWeight: 'bold',
        lineHeight: 1,
        transform: 'rotate(-15deg)',
        transformOrigin: 'top center',
        ...textCss,
      }}
    >
      {text}
    </div>
    <img src={img} css={{ position: 'relative', width: 140 }} />
  </Box>
)
const Pinned = () => <Stamp text="置顶" color="#2F54EB" img={pinned} />
const Hot = () => <Stamp text="热帖" color="#FA541C" img={hot} />
const Excellent = () => <Stamp text="优秀" color="#1890FF" img={excellent} />
const Digest = () => <Stamp text="精华" color="#B37300" img={digest} />
const Recommended = () => (
  <Stamp text="推荐" color="#FA541C" img={recommended} />
)

export const InternalStamp = () => (
  <Box
    position="absolute"
    right={0}
    top={0}
    zIndex={1}
    color="red"
    border="5px solid red"
    px={1}
    py={0.25}
    fontSize={26}
    fontWeight={700}
    boxShadow="0 0 16px rgba(255, 0, 0, 0.5), inset 0 0 16px rgba(255, 0, 0, 0.5)"
    sx={{
      pointerEvents: 'none',
      transform: 'translate(0, -50%)',
      opacity: 0.7,
    }}
  >
    内部交流，严禁外传
  </Box>
)

export const ThreadStamp = ({ stamp }: { stamp?: number }) => {
  switch (stamp) {
    case 0:
      return <Pinned />
    case 1:
      return <Hot />
    case 2:
      return <Stamp text="美图" color="#FA541C" img={hot} />
    case 3:
      return <Excellent />
    case 4:
      return <Digest />
    case 5:
      return <Recommended />
    case 6:
      return <Stamp text="原创" color="#FA541C" img={recommended} />
    case 7:
      return (
        <Stamp
          text="版主推荐"
          color="#FA541C"
          img={recommended}
          textCss={{ fontSize: 24, bottom: 40, paddingLeft: 6 }}
        />
      )
    case 8:
      return <Stamp text="爆料" color="#FA541C" img={hot} />
    case 19:
      return (
        <Stamp
          text="编辑采用"
          color="#1890FF"
          img={excellent}
          textCss={{ fontSize: 24, bottom: 40, paddingLeft: 6 }}
        />
      )
    case 22:
      return <Stamp text="VIP" color="#FA541C" img={hot} />
    default:
      return <></>
  }
}
