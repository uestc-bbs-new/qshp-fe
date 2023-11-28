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
  useTheme,
} from '@mui/material'

import { ForumDetails } from '@/common/interfaces/response'
import Link from '@/components/Link'
import Separated from '@/components/Separated'

type HeadProps = {
  data: ForumDetails
}

const Head = ({ data }: HeadProps) => {
  const [isHeadOpen, setHeadOpen] = useState(true)
  const theme = useTheme()
  const handleClick = () => {
    setHeadOpen(!isHeadOpen)
  }
  const moderators = data?.moderators || []
  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: 280, height: 50 }}
            >
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
              <Divider orientation="vertical" variant="middle" flexItem />
              <Stack direction="row" alignItems="center">
                <Typography>主题：</Typography>
                <Typography fontWeight="bold">{data?.threads}</Typography>
              </Stack>
            </Stack>
            <Stack direction="row">
              {moderators.length > 0 && <Typography>版主：</Typography>}
              {/* <Stack direction="row" alignItems="center">
                {moderators.map((item: any) => (
                  <Typography className="pr-5" key={item}>
                    {item},
                  </Typography>
                ))}
              </Stack> */}
              <Separated
                separator={<Typography marginRight="0.35em">,</Typography>}
              >
                {moderators.map((moderator, index) => (
                  <Link
                    key={index}
                    color="inherit"
                    variant="subtitle2"
                    to={`/user/name/${moderator}`}
                  >
                    {moderator}
                  </Link>
                ))}
              </Separated>
            </Stack>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            dangerouslySetInnerHTML={{ __html: data?.announcement }}
          />
          {/* <ParsePost></ParsePost> */}
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default Head
