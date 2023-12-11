import dayjs from 'dayjs/esm'
import 'dayjs/esm/locale/zh-cn'
import calendar from 'dayjs/esm/plugin/calendar'
import relativeTime from 'dayjs/esm/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(calendar)
dayjs.extend(relativeTime)

export const chineseTime = (time: number, short?: boolean) => {
  if (Date.now() - time < 1000 * 60) {
    return '刚刚'
  }
  if (Date.now() - time < 1000 * 60 * 60 * 3) {
    return dayjs(time).fromNow()
  }
  return dayjs(time).calendar(null, {
    sameDay: '[今天] HH:mm', // The same day ( Today at 2:30 AM )
    nextDay: '[明天] HH:mm', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd HH:mm', // The next week ( Sunday at 2:30 AM )
    lastDay: '[昨天] HH:mm', // The day before ( Yesterday at 2:30 AM )
    lastWeek: '[上周] dddd HH:mm', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'YYYY-MM-DD' + (short ? '' : ' HH:mm'), // Everything else ( 17/10/2011 )
  })
}
