import { Interpolation, Theme } from '@emotion/react'

import { MutableRefObject } from 'react'

import {
  AttachFile,
  ExpandMore,
  HighlightOff,
  RestoreFromTrash,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'

import { EditorAttachment, PostEditorValue } from './types'

const imgStyle: Interpolation<Theme> = {
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'cover',
}

const AttachmentManager = ({
  attachments,
  onUpdateAttachments,
  valueRef,
}: {
  attachments: EditorAttachment[]
  onUpdateAttachments: (newAttachments: EditorAttachment[]) => void
  valueRef: MutableRefObject<PostEditorValue>
}) => {
  return (
    <Box mt={1}>
      <Accordion disableGutters elevation={2}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ minHeight: 0, py: 0.5 }}
        >
          附件管理 ({attachments?.length})
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            {attachments.map((item, index) => (
              <Grid key={item.attachment_id} xs={3} sm={2} md={1} item>
                <Stack alignItems="center">
                  <Box position="relative" width="100%" pb="100%">
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      position="absolute"
                      left={0}
                      right={0}
                      top={0}
                      bottom={0}
                      sx={item.deleted ? { opacity: 0.5 } : undefined}
                    >
                      {item.is_image ? (
                        <img
                          src={item.thumbnail_url || item.path}
                          css={imgStyle}
                        />
                      ) : (
                        <AttachFile />
                      )}
                    </Stack>
                  </Box>
                  <Typography
                    sx={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      textDecoration: item.deleted ? 'line-through' : undefined,
                    }}
                  >
                    {item.filename}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      if (!valueRef.current.attachments) {
                        return
                      }
                      const vIndex = valueRef.current.attachments.findIndex(
                        (attach) => attach.attachment_id == item.attachment_id
                      )
                      const newAttachments = [...attachments]
                      if (item.deleted) {
                        if (vIndex != -1) {
                          return
                        }
                        const newAttach = { ...item }
                        delete newAttach['deleted']
                        valueRef.current.attachments.push({ ...newAttach })
                        newAttachments[index] = { ...newAttach }
                        onUpdateAttachments(newAttachments)
                      } else {
                        if (vIndex == -1) {
                          return
                        }
                        valueRef.current.attachments.splice(vIndex, 1)
                        newAttachments[index] = {
                          ...newAttachments[index],
                          deleted: true,
                        }
                        onUpdateAttachments(newAttachments)
                      }
                    }}
                  >
                    {item.deleted ? <RestoreFromTrash /> : <HighlightOff />}
                  </IconButton>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default AttachmentManager
