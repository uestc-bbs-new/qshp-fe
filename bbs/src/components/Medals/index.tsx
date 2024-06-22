import { css } from '@emotion/react'

import { Skeleton, Stack, Tooltip, Typography } from '@mui/material'

import { Medal as MedalItem } from '@/common/interfaces/system'
import { useMedals } from '@/states/settings'
import siteRoot from '@/utils/siteRoot'

export const Medal = ({
  medal,
  dense,
}: {
  medal?: MedalItem
  dense?: boolean
}) =>
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
        css={css({ margin: dense ? '0 0.15em' : '0.25em 0.15em' })}
      />
    </Tooltip>
  ) : (
    <></>
  )

const Medals = ({
  medals,
  nowrap,
  dense,
}: {
  medals?: number[]
  nowrap?: boolean
  dense?: boolean
}) => {
  const { medalMap } = useMedals()
  return medalMap ? (
    <Stack direction="row" flexWrap={nowrap ? 'nowrap' : 'wrap'}>
      {medals?.map((id, index) => (
        <Medal key={index} medal={medalMap[id]} dense={dense} />
      ))}
    </Stack>
  ) : (
    <Skeleton />
  )
}

export default Medals
