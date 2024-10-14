import moment from 'moment'

export const bookingsAggregationPipeline = (nameRegex: RegExp) => {
  return [
    {
      $lookup: {
        from: 'users',
        localField: 'customer',
        foreignField: '_id',
        as: 'customerInfo',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'seller',
        foreignField: '_id',
        as: 'sellerInfo',
      },
    },
    {
      $lookup: {
        from: 'services',
        localField: 'serviceId',
        foreignField: '_id',
        as: 'serviceInfo',
      },
    },
    {
      $lookup: {
        from: 'shops',
        localField: 'shop',
        foreignField: '_id',
        as: 'shopInfo',
      },
    },
    {
      $unwind: '$customerInfo',
    },
    {
      $unwind: '$sellerInfo',
    },
    {
      $unwind: '$serviceInfo',
    },
    {
      $unwind: '$shopInfo',
    },
    {
      $match: {
        $or: [
          { 'customerInfo.firstName': { $regex: nameRegex } },
          { 'customerInfo.lastName': { $regex: nameRegex } },
          { 'sellerInfo.firstName': { $regex: nameRegex } },
          { 'sellerInfo.lastName': { $regex: nameRegex } },
          { 'serviceInfo.name': { $regex: nameRegex } },
          { 'shopInfo.shopName': { $regex: nameRegex } },
        ],
      },
    },
  ]
}

export const areBothTimesInBetween = (
  startTime: string,
  endTime: string,
  openingHour: string,
  closingHour: string,
) => {
  const time1 = moment(startTime, 'HH:mm')
  const time2 = moment(endTime, 'HH:mm')
  const openingTime = moment(openingHour, 'HH:mm')
  const closingTime = moment(closingHour, 'HH:mm')

  return (
    time1.isBetween(openingTime, closingTime, null, '[]') &&
    time2.isBetween(openingTime, closingTime, null, '[]')
  )
}

export const generateId = (prefix: string, amount: number): string => {
  return `${prefix}${Math.floor(amount)}-${Math.floor(
    10000000 + Math.random() * 90000000,
  )}`
}

export const isServiceDateTimeAtLeastOneHourInPast = (
  serviceDateStr: string,
  serviceTimeStr: string,
) => {
  const serviceDate = moment(serviceDateStr)
  const serviceTimeMoment = moment(serviceTimeStr, 'h:mmA')

  // Combine service date with service time
  const serviceDateTime = serviceDate
    .hours(serviceTimeMoment.hours())
    .minutes(serviceTimeMoment.minutes())

  // Get the current date and time
  const currentDateTime = moment()

  // Subtract one hour from the current date and time for comparison
  const oneHourAfterServiceTime = serviceDateTime.clone().add(1, 'hour')

  // Check if the current time is at least one hour after the service time
  if (currentDateTime.isBefore(oneHourAfterServiceTime)) {
    return false
  }

  // Return true if the current time is at least one hour after the service date and time
  return true
}
