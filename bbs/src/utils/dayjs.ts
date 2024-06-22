import dayjs from 'dayjs/esm'
import 'dayjs/esm/locale/zh-cn'
import calendar from 'dayjs/esm/plugin/calendar'
import duration from 'dayjs/esm/plugin/duration'
import relativeTime from 'dayjs/esm/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(calendar)
dayjs.extend(relativeTime)
dayjs.extend(duration)

export const chineseTime = (
  time: number,
  options?: { short?: boolean; full?: boolean }
) => {
  if (options?.full) {
    return dayjs(time).format('YYYY-MM-DD HH:mm')
  }
  const now = new Date()
  let format = 'YYYY-MM-DD' + (options?.short ? '' : ' HH:mm')
  if (time > now.getTime()) {
    return dayjs(time).format(format)
  } else {
    if (time > now.getTime() - 1000 * 60 && time < now.getTime()) {
      return '刚刚'
    }
    if (Date.now() - time < 1000 * 60 * 60 * 3) {
      return dayjs(time).fromNow()
    }
  }
  const date = new Date(time)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  )
  let dayOffset = now.getDay() - 1
  if (dayOffset === -1) {
    dayOffset = 6
  }
  const beginOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - dayOffset
  )
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - dayOffset - 7
  )
  const timeSuffix = options?.short ? '' : ' HH:mm'
  if (date.getTime() >= today.getTime()) {
    format = 'HH:mm'
  } else if (date.getTime() >= yesterday.getTime()) {
    format = '[昨天]' + timeSuffix
  } else if (date.getTime() >= beginOfWeek.getTime()) {
    format = 'dddd' + timeSuffix
  } else if (date.getTime() >= lastWeek.getTime()) {
    format = '[上]ddd' + timeSuffix
  }
  return dayjs(time).format(format)
}

export const chineseDuration = (seconds: number) =>
  dayjs.duration({ seconds }).humanize()
