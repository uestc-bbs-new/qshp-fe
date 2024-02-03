import { css } from '@emotion/react'

import { Skeleton, Stack, Tooltip, Typography } from '@mui/material'

import { Medal as MedalItem } from '@/common/interfaces/system'
import { useMedals } from '@/states/settings'
import siteRoot from '@/utils/siteRoot'

export const Medal = ({ medal }: { medal?: MedalItem }) =>
  medal ? (
    <Tooltip
      title={
        <Stack>
          <Typography fontWeight="bold" fontSize="1.05rem" py={0.25}>
            {medal.name}
          </Typography>
          <Typography sx={{ opacity: 0.85 }}>{medal.description}</Typography>
        </Stack>
      }
      placement="top"
    >
      <img
        src={`${siteRoot}/static/image/common/${medal.image_path}`}
        loading="lazy"
        css={css({ margin: '0.25em 0.15em' })}
      />
    </Tooltip>
  ) : (
    <></>
  )

const Medals = ({ medals }: { medals?: number[] }) => {
  const { medalMap } = useMedals()
  return medalMap ? (
    <Stack direction="row" flexWrap="wrap">
      {medals?.map((id, index) => <Medal key={index} medal={medalMap[id]} />)}
    </Stack>
  ) : (
    <Skeleton />
  )
}

export default Medals
