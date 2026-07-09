import type { WeekKey } from './types'

export function getIsoWeekStart(week: WeekKey): Date {
  const match = /^(\d{4})_W(\d{1,2})$/.exec(week)

  if (!match) {
    throw new Error(`Invalid week key: ${week}`)
  }

  const year = Number(match[1])
  const weekNumber = Number(match[2])

  if (weekNumber < 1 || weekNumber > getIsoWeeksInYear(year)) {
    throw new Error(`Invalid week key: ${week}`)
  }

  const januaryFourth = new Date(Date.UTC(year, 0, 4))
  const januaryFourthDay = januaryFourth.getUTCDay() || 7
  const firstIsoWeekStart = new Date(januaryFourth)
  firstIsoWeekStart.setUTCDate(januaryFourth.getUTCDate() - januaryFourthDay + 1)

  return addWeeks(firstIsoWeekStart, weekNumber - 1)
}

export function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + weeks * 7)
  return result
}

function getIsoWeeksInYear(year: number): number {
  const nextYearStart = getFirstIsoWeekStart(year + 1).getTime()
  const yearStart = getFirstIsoWeekStart(year).getTime()

  return Math.round((nextYearStart - yearStart) / (7 * 24 * 60 * 60 * 1000))
}

function getFirstIsoWeekStart(year: number): Date {
  const januaryFourth = new Date(Date.UTC(year, 0, 4))
  const januaryFourthDay = januaryFourth.getUTCDay() || 7
  const firstIsoWeekStart = new Date(januaryFourth)
  firstIsoWeekStart.setUTCDate(januaryFourth.getUTCDate() - januaryFourthDay + 1)

  return firstIsoWeekStart
}
