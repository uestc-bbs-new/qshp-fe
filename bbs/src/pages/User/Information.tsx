import EditNoteIcon from '@mui/icons-material/EditNote'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'

function Information() {
  const info = [
    {
      title: '基本信息',
      content: 'UID：xxx',
    },
    {
      title: '自我介绍',
      content: '现在还没有自我介绍',
    },
    {
      title: '自定义头衔',
      content: '锄禾日当午，长河落日圆，谁是当午谁是圆',
    },
    {
      title: '个人签名',
      content: '互联网没有记忆，但是我有显示器事件尚未回复',
    },
  ]
  const activity = [
    {
      title: '最后访问',
      time: '2023-11-3 17：04',
    },
    {
      title: '注册时间',
      time: '2023-11-3 17：04',
    },
    {
      title: '上次发表时间',
      time: '2023-11-3 17：04',
    },
    {
      title: '上次活动时间',
      time: '2023-11-3 17：04',
    },
  ]
  return (
    <Box className="flex-1">
      <Stack
        direction="row"
        justifyContent={'flex-end'}
        style={{ color: 'rgb(33, 117, 243)' }}
      >
        <Typography fontSize={12} align="right" className="m-1">
          编辑
        </Typography>
        <EditNoteIcon />
      </Stack>
      <Divider />
      {info.map((list, index) => (
        <Box key={index} sx={{ margin: 1.5 }}>
          <Typography fontSize={16} fontWeight={500}>
            {list.title}
          </Typography>
          <Typography className="m-1 " color={'rgb(95, 97, 102)'}>
            {list.content}
          </Typography>
          <Divider />
        </Box>
      ))}
      <Box sx={{ margin: 1.5 }}>
        <Typography fontSize={16} fontWeight={500}>
          活跃情况
        </Typography>
        <Grid container spacing={1.5} sx={{ width: 500 }}>
          {activity.map((data, index) => (
            <Grid item xs={6} key={index}>
              <Stack direction="row" spacing={2} className="m-1 ">
                <Typography>{data.title}:</Typography>
                <Typography color="rgb(95, 97, 102)">{data.time}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Information
