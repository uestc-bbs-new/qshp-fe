import {
  Alert,
  AlertTitle,
  Button,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'

import { parseApiError } from '@/apis/error'
import { payForum } from '@/apis/forum'
import { ExtCreditMap, extCreditNames } from '@/common/interfaces/base'
import {
  ForumRestrictions,
  errForumRestrictedByCredits,
  errForumRestrictedByPay,
} from '@/common/interfaces/errors'

import Separated from '../Separated'

const Credits = ({ extCredits }: { extCredits: ExtCreditMap }) => (
  <Separated separator="，">
    {extCreditNames
      .filter((k) => extCredits[k])
      .map((k) => (
        <>
          {extCredits[k]} {k}
        </>
      ))}
  </Separated>
)

const creditsEnough = (restrictions: ForumRestrictions) =>
  extCreditNames.every((k) => {
    if (restrictions.ext_credits_delta && restrictions.ext_credits_delta[k]) {
      return (
        (restrictions.ext_credits_delta[k] || 0) <=
        (restrictions.ext_credits[k] || 0)
      )
    }
    return true
  })

const Error = ({
  error,
  sx,
  onRefresh,
  small,
}: {
  error: any
  sx?: SxProps<Theme>
  onRefresh?: () => void
  small?: boolean
}) => {
  const { message, severity, title, forumRestrictions } = parseApiError(error)

  return (
    <Alert
      severity={severity}
      sx={{ ...(small ? { alignItems: 'center' } : { py: 2, mx: 2 }), ...sx }}
      action={
        error.type == 'network' && onRefresh ? (
          <Stack alignItems="center">
            <Button onClick={onRefresh}>刷新</Button>
          </Stack>
        ) : null
      }
    >
      <AlertTitle sx={small ? undefined : { fontSize: 20 }}>{title}</AlertTitle>
      <Typography sx={small ? undefined : { fontSize: 16, my: 1 }}>
        {message}
      </Typography>
      {error.code == errForumRestrictedByCredits && forumRestrictions && (
        <Typography sx={{ fontSize: 16 }}>
          当前积分：
          <Credits extCredits={forumRestrictions.ext_credits} />
        </Typography>
      )}
      {error.code == errForumRestrictedByPay &&
        forumRestrictions?.ext_credits_delta && (
          <>
            <Typography sx={{ fontSize: 16 }}>
              需要支付{' '}
              <Credits extCredits={forumRestrictions.ext_credits_delta} />
              ，您当前拥有{' '}
              <Credits extCredits={forumRestrictions.ext_credits} />。
            </Typography>
            <Button
              variant="contained"
              disabled={!creditsEnough(forumRestrictions)}
              onClick={() =>
                forumRestrictions &&
                payForum(forumRestrictions.forum_id).then(
                  () => onRefresh && onRefresh()
                )
              }
              sx={{ mt: 2 }}
            >
              确认支付
            </Button>
          </>
        )}
    </Alert>
  )
}

export default Error
