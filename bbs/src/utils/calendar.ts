export const kCalendarTid = 1493930

type Ymd = [number, number, number]
const terms: Array<{ start: Ymd; end: Ymd }> = [
  {
    start: [2025, 9, 1],
    end: [2026, 1, 18],
  },
  {
    start: [2026, 3, 2],
    end: [2026, 7, 19],
  },
]

const toDate = (ymd: Ymd) => {
  const [y, m, d] = ymd
  return new Date(y, m - 1, d)
}

export const getTermWeek = (date?: Date) => {
  const today = date ?? new Date()
  for (const term of terms) {
    const start = toDate(term.start)
    const end = toDate(term.end)
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    end.setMilliseconds(999)
    if (today >= start && today <= end) {
      return (
        Math.floor(
          (today.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 / 7
        ) + 1
      )
    }
  }
}
