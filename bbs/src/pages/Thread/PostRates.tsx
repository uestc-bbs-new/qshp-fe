import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { PostRate, PostRateStat } from '@/common/interfaces/response'
import Avatar from '@/components/Avatar'
import Chip from '@/components/Chip'
import Link from '@/components/Link'

const PostRates = ({
  rates,
  rateStat,
}: {
  rates: PostRate[]
  rateStat: PostRateStat
}) => {
  const kCreditNamesToPromote = ['威望', '奖励券']
  const kCreditNamesInOrder = ['威望', '水滴', '奖励券']
  const kMaxPromotedRates = 3
  const kMaxInitialRates = 10
  const promotedRates = []
  let initialRates = []
  const usedCredits: string[] = []
  for (const rate of rates) {
    if (
      kCreditNamesToPromote.some((name) => rate.credits[name]) &&
      promotedRates.length < kMaxPromotedRates
    ) {
      promotedRates.push(rate)
    } else if (initialRates.length < kMaxInitialRates) {
      initialRates.push(rate)
    }
  }
  initialRates = promotedRates.concat(initialRates).slice(0, kMaxInitialRates)
  kCreditNamesInOrder.forEach(
    (name) => rateStat.total_credits[name] && usedCredits.push(name)
  )
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">评分</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingY: 0 }}>
        <Table>
          <TableHead>
            <TableCell sx={{ width: '14em' }}>
              共 {rateStat.total_users} 人参与
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
                    text={
                      (rateStat.total_credits[name] > 0 ? '+' : '') +
                      rateStat.total_credits[name]
                    }
                  />
                )}
              </TableCell>
            ))}
            <TableCell>理由</TableCell>
          </TableHead>
          <TableBody>
            {initialRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link to={`/user/${rate.user_id}`}>
                    <Stack direction="row" alignItems="center">
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                        uid={rate.user_id}
                      />
                      <Typography ml={1}>{rate.username}</Typography>
                    </Stack>
                  </Link>
                </TableCell>
                {usedCredits.map((name, index) => (
                  <TableCell key={index} className="text-center">
                    {rate.credits[name] > 0 && '+'}
                    {rate.credits[name]}
                  </TableCell>
                ))}
                <TableCell>{rate.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rates.length > initialRates.length && (
          <Stack direction="row" justifyContent="flex-end" my={1}>
            <Button>查看更多</Button>
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default PostRates
