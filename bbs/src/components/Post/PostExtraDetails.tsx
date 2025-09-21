import React from 'react'

import { ExpandMore, SvgIconComponent } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'

export const PostExtraDetailsContainer = ({
  children,
  loading,
  hasContent,
}: {
  children?: React.ReactElement
  loading: boolean
  hasContent: boolean
}) => {
  const thinView = useMediaQuery('(max-width: 560px)')
  return (
    <>
      {(hasContent || loading) && (
        <Box my={thinView ? 1 : 2}>
          {hasContent && children}
          {loading && [
            <Skeleton key={1} height={50} />,
            <Skeleton key={2} height={50} />,
            <Skeleton key={3} height={50} />,
          ]}
        </Box>
      )}
    </>
  )
}

export const PostExtraDetailsAccordian = ({
  Icon,
  title,
  children,
}: {
  Icon: SvgIconComponent
  title: React.ReactNode
  children: React.ReactNode
}) => {
  const color = '#2175F3'
  return (
    <Accordion defaultExpanded disableGutters elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{ minHeight: 0, '& .MuiAccordionSummary-content': { my: 0 } }}
      >
        <Stack direction="row" alignItems="center">
          <Icon htmlColor={color} fontSize="small" />
          <Typography variant="subtitle1" ml={1} sx={{ color }}>
            {title}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingY: 0 }}>{children}</AccordionDetails>
    </Accordion>
  )
}
