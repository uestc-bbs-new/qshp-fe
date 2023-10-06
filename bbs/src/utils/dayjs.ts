import dayjs from 'dayjs/esm'
import 'dayjs/esm/locale/zh-cn'
import calendar from 'dayjs/esm/plugin/calendar'

dayjs.locale('zh-cn')
dayjs.extend(calendar)

export const chineseTime = (time: number) => {
  console.log('time:', time)

  return dayjs(time).calendar(null, {
    sameDay: '[今天] hh:mm', // The same day ( Today at 2:30 AM )
    nextDay: '[明天] hh:mm', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd hh:mm', // The next week ( Sunday at 2:30 AM )
    lastDay: '[昨天] hh:mm', // The day before ( Yesterday at 2:30 AM )
    lastWeek: '[上周] dddd hh:mm', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'YYYY-MM-DD', // Everything else ( 17/10/2011 )
  })
}
