import { add, differenceInHours, sub, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const TZ = 'America/Sao_Paulo'

export function getTodayMorning(): Date {
  const now = utcToZonedTime(new Date(), TZ)
  let startOf = startOfDay(now)

  if (differenceInHours(now, startOf) < 3) {
    startOf = startOfDay(sub(now, { days: 1 }))
  }
  return add(startOf, { hours: 3 })
}
