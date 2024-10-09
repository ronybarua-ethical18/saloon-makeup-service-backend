import moment from 'moment'

interface TimeSlot {
  startTime: string
  maxResourcePerHour: number
}

export const generateTimeSlots = (
  openingHour: string,
  closingHour: string,
  maxResourcePerHour: number,
): TimeSlot[] => {
  // Define the format for the time strings
  const timeFormat = 'h:00A'

  // Parse the opening and closing hours into Moment objects
  const start = moment(openingHour, timeFormat)
  const end = moment(closingHour, timeFormat)

  // Array to hold the generated time slots
  const timeSlots: TimeSlot[] = []

  // Generate time slots from opening to closing hour
  while (start.isSameOrBefore(end)) {
    timeSlots.push({
      startTime: start.format(timeFormat),
      maxResourcePerHour,
    })

    // Move to the next hour
    start.add(1, 'hour')
  }

  return timeSlots
}
