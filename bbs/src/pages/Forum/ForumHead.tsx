import React, { useState } from 'react'

import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

import { ForumDetails } from '@/common/interfaces/forum'
import Link from '@/components/Link'
import { UserHtmlRenderer } from '@/components/RichText'
import Separated from '@/components/Separated'
import { pages } from '@/utils/routes'

type HeadProps = {
  data: ForumDetails
}

const Head = ({ data }: HeadProps) => {
  const [isHeadOpen, setHeadOpen] = useState(true)
  const moderators = data?.moderators || []
  return (
    <>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={(theme) => ({ ...theme.commonSx.headerCardGradient })}
        >
          <Box>
            <Stack direction="row">
              <Stack
                direction="row"
                className="pr-5"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontSize={19} fontWeight="bold">
                  {data?.name}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography>今日：</Typography>
                <Typography fontWeight="bold">{data?.todayposts}</Typography>
              </Stack>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                className="mx-4"
              />
              <Stack direction="row" alignItems="center">
                <Typography>主题：</Typography>
                <Typography fontWeight="bold">{data?.threads}</Typography>
              </Stack>
            </Stack>
            <Stack direction="row">
              {moderators.length > 0 && <Typography>版主：</Typography>}
              <Separated
                separator={<Typography marginRight="0.35em">,</Typography>}
              >
                {moderators.map((moderator, index) => (
                  <Link
                    key={index}
                    color="inherit"
                    variant="subtitle2"
                    to={pages.user({ username: moderator })}
                  >
                    {moderator}
                  </Link>
                ))}
              </Separated>
            </Stack>
          </Box>
        </AccordionSummary>
        {!!data?.announcement && (
          <AccordionDetails>
            <UserHtmlRenderer html={data?.announcement} />
          </AccordionDetails>
        )}
      </Accordion>
    </>
  )
}

export default Head
