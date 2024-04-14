import React from 'react'

import { Grid, Stack, SxProps, Theme, Typography } from '@mui/material'

import { AttachmentSummary } from '@/common/interfaces/base'
import { ThreadBasics } from '@/common/interfaces/response'
import { useAppState } from '@/states'
import { pages } from '@/utils/routes'
import { setVariantForThumbnailUrl } from '@/utils/thumbnail'

import Link from '../Link'

const kMaxAttachmentInSummary = 9

export const SummaryAttachmentItem = ({
  item,
  onClick,
}: {
  item: AttachmentSummary
  onClick?: () => void
}) => (
  <SummaryAttachmentGrid onClick={onClick}>
    <img
      src={
        item.thumbnail_url
          ? setVariantForThumbnailUrl(item.thumbnail_url, 'summary')
          : item.path
      }
      loading="lazy"
      css={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  </SummaryAttachmentGrid>
)

export const SummaryAttachmentMore = ({ threadId }: { threadId: number }) => (
  <SummaryAttachmentGrid sx={{ backgroundColor: '#eeeeee' }}>
    <Link
      to={pages.thread(threadId)}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      ...
    </Link>
  </SummaryAttachmentGrid>
)
export const SummaryAttachmentGrid = ({
  children,
  sx,
  onClick,
}: {
  children?: React.ReactNode
  sx?: SxProps<Theme>
  onClick?: () => void
}) => (
  <Grid m={0.5} sx={{ cursor: 'pointer', ...sx }} onClick={onClick}>
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ width: 72, height: 72 }}
    >
      {children}
    </Stack>
  </Grid>
)

const Summary = ({
  item,
}: {
  item: Pick<ThreadBasics, 'thread_id' | 'summary' | 'summary_attachments'>
}) => {
  const { dispatch } = useAppState()
  return (
    <>
      {item.summary && (
        <Typography variant="threadItemSummary" mb={0.5}>
          {item.summary}
        </Typography>
      )}
      {!!item.summary_attachments?.length && (
        <Grid container>
          {item.summary_attachments
            .filter((item) => item.is_image)
            .slice(0, kMaxAttachmentInSummary)
            .map((item, index) => (
              <SummaryAttachmentItem
                item={item}
                onClick={() => {
                  dispatch({
                    type: 'open dialog',
                    payload: {
                      kind: 'image',
                      imageDetails: item.path,
                    },
                  })
                }}
                key={index}
              />
            ))}
          {item.summary_attachments.length > kMaxAttachmentInSummary && (
            <SummaryAttachmentMore threadId={item.thread_id} />
          )}
        </Grid>
      )}
    </>
  )
}

export default Summary
