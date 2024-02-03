import { css } from '@emotion/react'

import { Skeleton, Stack, Tooltip } from '@mui/material'

import { useMedals } from '@/states/settings'
import siteRoot from '@/utils/siteRoot'

const Medals = ({ medals }: { medals?: number[] }) => {
  const { medalMap } = useMedals()
  return medalMap ? (
    <Stack direction="row" flexWrap="wrap">
      {medals?.map((id, index) => (
        <Tooltip key={index} title={medalMap[id]?.name}>
          <img
            src={`${siteRoot}/static/image/common/${medalMap[id]?.image_path}`}
            loading="lazy"
            css={css({ margin: '0.25em 0.15em' })}
          />
        </Tooltip>
      ))}
    </Stack>
  ) : (
    <Skeleton />
  )
}

export default Medals
