import { useState } from 'react'

import { Close, Reviews } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material'

import { PostRate, PostRateStat } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import Link from '@/components/Link'
import { pages } from '@/utils/routes'

import { PostExtraDetailsAccordian } from './PostExtraDetails'

const kCreditNamesToPromote = ['威望', '奖励券']
const kCreditNamesInOrder = ['威望', '水滴', '奖励券']
const kMaxPromotedRates = 3
const kMaxInitialRates = 10

const PostRates = ({
  rates,
  rateStat,
}: {
  rates: PostRate[]
  rateStat: PostRateStat
}) => {
  const linearView = useMediaQuery('(max-width: 720px')
  const maxInitialRates = linearView ? 3 : kMaxInitialRates

  const promotedRates = []
  let initialRates = []
  const usedCredits: string[] = []
  for (const rate of rates) {
    if (
      kCreditNamesToPromote.some((name) => rate.credits[name]) &&
      promotedRates.length < kMaxPromotedRates
    ) {
      promotedRates.push(rate)
    } else if (initialRates.length < maxInitialRates) {
      initialRates.push(rate)
    }
  }
  initialRates = promotedRates.concat(initialRates).slice(0, maxInitialRates)
  kCreditNamesInOrder.forEach(
    (name) =>
      rateStat.total_credits[name] != undefined && usedCredits.push(name)
  )

  const [moreOpen, setMoreOpen] = useState(false)
  const closeMore = () => setMoreOpen(false)

  return (
    <PostExtraDetailsAccordian
      Icon={Reviews}
      title={
        <>
          评分
          {linearView && (
            <>
              <Chip className="ml-2" text={`${rateStat.total_users} 人参与`} />
              {usedCredits
                .filter((name) => !!rateStat.total_credits[name])
                .map((name) => (
                  <Chip
                    key={name}
                    className="ml-2"
                    type={
                      rateStat.total_credits[name] > 0
                        ? undefined
                        : 'rateNegative'
                    }
                    text={`${name} ${
                      rateStat.total_credits[name] > 0 ? '+' : ''
                    }${rateStat.total_credits[name]}`}
                  />
                ))}
            </>
          )}
        </>
      }
    >
      {linearView ? (
        <RateList rates={initialRates} />
      ) : (
        <RateTable
          rates={initialRates}
          rateStat={rateStat}
          usedCredits={usedCredits}
        />
      )}
      {rates.length > initialRates.length && (
        <>
          <Stack direction="row" justifyContent="flex-end" my={1}>
            <Button onClick={() => setMoreOpen(true)}>查看更多</Button>
          </Stack>
          <Dialog
            open={moreOpen}
            fullWidth
            maxWidth="md"
            onClose={closeMore}
            sx={{
              maxHeight: '80%',
              margin: 'auto',
            }}
          >
            <DialogTitle>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>查看全部评分</Typography>
                <IconButton onClick={closeMore}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              {linearView ? (
                <RateList rates={rates} />
              ) : (
                <RateTable
                  rates={rates}
                  rateStat={rateStat}
                  usedCredits={usedCredits}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </PostExtraDetailsAccordian>
  )
}

const RateList = ({ rates }: { rates: PostRate[] }) => {
  return (
    <>
      {rates.map((rate, index) => (
        <Box key={index} my={1}>
          <Stack direction="row" justifyContent="space-between">
            <Link to={pages.user({ uid: rate.user_id })} underline="hover">
              <Avatar
                sx={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
                size={28}
                uid={rate.user_id}
              />
              <Typography
                ml={0.75}
                mr={1.25}
                sx={{
                  verticalAlign: 'middle',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  textDecoration: 'inherit',
                }}
              >
                {rate.username}
              </Typography>
            </Link>
            <Stack direction="row" alignItems="center">
              {Object.entries(rate.credits).map(([name, value]) => (
                <Chip
                  key={name}
                  className="ml-2"
                  type={value > 0 ? undefined : 'rateNegative'}
                  text={name + ' ' + (value > 0 ? '+' : '') + value}
                />
              ))}
            </Stack>
          </Stack>
          <Typography sx={{ pl: 4 }}>{rate.reason}</Typography>
        </Box>
      ))}
    </>
  )
}

const RateTable = ({
  rates,
  rateStat,
  usedCredits,
}: {
  rates: PostRate[]
  rateStat: PostRateStat
  usedCredits: string[]
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '14em' }}>
            参与用户
            <Chip className="ml-2" text={`${rateStat.total_users}`} />
          </TableCell>
          {usedCredits.map((name, index) => (
            <TableCell
              key={index}
              className="text-center"
              sx={{ width: '12em' }}
            >
              {name}
              {rateStat.total_credits[name] != 0 && (
                <Chip
                  className="ml-2"
                  type={
                    rateStat.total_credits[name] > 0
                      ? undefined
                      : 'rateNegative'
                  }
                  text={
                    (rateStat.total_credits[name] > 0 ? '+' : '') +
                    rateStat.total_credits[name]
                  }
                />
              )}
            </TableCell>
          ))}
          <TableCell>理由</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rates.map((rate, index) => (
          <TableRow key={index}>
            <TableCell>
              <Link to={pages.user({ uid: rate.user_id })} underline="hover">
                <Stack direction="row" alignItems="center">
                  <Avatar
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                    size={28}
                    uid={rate.user_id}
                  />
                  <Typography ml={1} fontWeight="bold">
                    {rate.username}
                  </Typography>
                </Stack>
              </Link>
            </TableCell>
            {usedCredits.map((name, index) => (
              <TableCell
                key={index}
                className="text-center"
                sx={{ color: rate.credits[name] < 0 ? '#F56C6C' : '#6AA1FF' }}
              >
                {rate.credits[name] > 0 && '+'}
                {rate.credits[name]}
              </TableCell>
            ))}
            <TableCell>{rate.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PostRates
