import dayjs from 'dayjs/esm'
import 'dayjs/esm/locale/zh-cn'
import calendar from 'dayjs/esm/plugin/calendar'
dayjs.locale('zh-cn')
dayjs.extend(calendar)

export const chineseTime = (time: number) => {
  return dayjs().calendar(time, {
    sameDay: '[今天] h:mm A', // The same day ( Today at 2:30 AM )
    nextDay: '[明天] h:mm A', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd h:mm A', // The next week ( Sunday at 2:30 AM )
    lastDay: '[昨天] h:mm A', // The day before ( Yesterday at 2:30 AM )
    lastWeek: '[上周] dddd h:mm A', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'YYYY[年]MM[月]DD[日]', // Everything else ( 17/10/2011 )
  })
}
