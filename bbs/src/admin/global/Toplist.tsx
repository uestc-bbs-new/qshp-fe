import { useQuery } from '@tanstack/react-query'

import { Box, Stack, Typography } from '@mui/material'

import { HotlistWeights, getHotlistConfig } from '@/apis/admin/toplist'
import Link from '@/components/Link'
import { globalCache, useForumList } from '@/states'
import { pages } from '@/utils/routes'

const WeightEntry = ({ text, value }: { text: string; value?: number }) => (
  <Stack alignItems="center">
    <Typography>{text}</Typography>
    <Typography>{value}</Typography>
  </Stack>
)

const WeightView = ({ weight }: { weight: HotlistWeights }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap">
    <WeightEntry text="总权重" value={weight.overall ?? 1} />
    <WeightEntry text="点赞" value={weight.likes} />
    <WeightEntry text="点踩" value={weight.dislikes} />
    <WeightEntry text="回复" value={weight.replies} />
    <WeightEntry text="点评" value={weight.comments} />
    <WeightEntry text="收藏" value={weight.favorites} />
    <WeightEntry text="回复作者" value={weight.reply_authors} />
    <WeightEntry text="点评作者" value={weight.comment_authors} />
    <WeightEntry text="正面评分次数" value={weight.positive_rates} />
    <WeightEntry text="正面评分总数" value={weight.positive_scores} />
    <WeightEntry text="负面评分次数" value={weight.negative_rates} />
    <WeightEntry text="负面评分总数" value={weight.negative_scores} />
  </Stack>
)

const ForumEntry = ({ fid }: { fid: number }) => (
  <Link to={pages.forum(fid)} mx={1}>
    {globalCache.fidNameMap[fid]}
  </Link>
)

function dictMap<K extends string | number | symbol, V, R>(
  dict: { [k in K]: V },
  callback: (k: K, v: V) => R
) {
  const result = []
  for (const k in dict) {
    result.push(callback(k, dict[k]))
  }
  return result
}

const Toplist = () => {
  const { data: config } = useQuery({
    queryKey: ['admin', 'toplist/hotlist/config'],
    queryFn: getHotlistConfig,
  })
  useForumList()

  return (
    <>
      <Typography variant="h4">热门管理</Typography>
      <Typography variant="h5">当前配置</Typography>
      {config && (
        <>
          {config.excluded_fids && (
            <>
              <Typography variant="h6">排除版块：</Typography>
              {config.excluded_fids.map((fid) => (
                <ForumEntry key={fid} fid={fid} />
              ))}
            </>
          )}
          <Typography variant="h6">默认权重：</Typography>
          <WeightView weight={config.weights} />
          {config.fid_overrides && (
            <>
              <Typography variant="h6">版块权重：</Typography>
              {config.fid_overrides?.map((item, index) => (
                <Box key={index}>
                  {item.fids.map((fid) => (
                    <ForumEntry key={fid} fid={fid} />
                  ))}
                </Box>
              ))}
            </>
          )}
          {config.fid_top_limits && (
            <>
              <Typography variant="h6">前十版块限制：</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {dictMap(config.fid_top_limits, (fid, limit) => (
                  <Stack key={fid} alignItems="center">
                    <ForumEntry fid={fid} />
                    <Typography>{limit}</Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Toplist
