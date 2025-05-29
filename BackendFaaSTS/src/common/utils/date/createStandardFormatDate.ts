/**
 * Creates a standard format date string in the format "DD/MM/YYYY".
 *
 * @param {Date | string} date - The date to format, either as a Date object or a string in the format "DD/MM/YYYY".
 * @returns {string} The formatted date string.
 * @throws {Error} If the input date is not a valid Date object or string in the format "DD/MM/YYYY".
 */
export function createStandardFormatDate (date: Date | string): string {
  let year
  let month
  let day

  if (typeof date === 'string') {
    const [dayString, monthString, yearString] = date.split('/')
    year = Number(yearString)
    month = Number(monthString)
    day = Number(dayString)
  } else if (date instanceof Date && !isNaN(date.getTime())) {
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()
  } else {
    throw new Error('Invalid date format. Please provide a valid Date object or string in the format "DD/MM/YYYY".')
  }

  const monthString = month < 10 ? `0${month}` : `${month}`
  const dayString = day < 10 ? `0${day}` : `${day}`

  return `${dayString}/${monthString}/${year}`
}
