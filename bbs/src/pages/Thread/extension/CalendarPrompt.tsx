import { useMediaQuery } from '@mui/material'

import { getTermWeek } from '@/utils/calendar'

const CalendarPrompt = () => {
  const week = getTermWeek()
  const mobile = useMediaQuery('(max-width: 560px)')
  if (week) {
    const today = new Date()
    return (
      <p css={{ fontSize: 20, color: '#006eff', textAlign: 'center' }}>
        今天是 {today.getFullYear()} 年 {today.getMonth() + 1} 月{' '}
        {today.getDate()} 日星期{'日一二三四五六'[today.getDay()]}，
        {mobile && <br />}
        本周为第 {week} 周。
      </p>
    )
  }
  return <></>
}

export default CalendarPrompt
