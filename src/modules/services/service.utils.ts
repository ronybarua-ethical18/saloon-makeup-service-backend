import { JwtPayload } from 'jsonwebtoken'
import { ServiceStatusList } from './service.interface'
import { ServiceModel } from './service.model'
import { Types } from 'mongoose'

export const getTotals = async (loggedUser: JwtPayload) => {
  // 1. Perform aggregation to get counts for each status
  const stats = await ServiceModel.aggregate([
    { $match: { seller: new Types.ObjectId(loggedUser.userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  // 2. Initialize result object with all statuses set to 0
  const initialResult = {
    total: 0,
    [ServiceStatusList.PENDING]: 0,
    [ServiceStatusList.APPROVED]: 0,
    [ServiceStatusList.REJECTED]: 0,
  }

  // 3. Reduce the stats array into a single object with counts
  const result = stats.reduce((acc, { _id, count }) => {
    if (_id in acc) {
      acc[_id as ServiceStatusList] = count
      acc.total += count
    }
    return acc
  }, initialResult)

  // 4. Return the final counts
  return {
    total: result.total,
    totalPending: result[ServiceStatusList.PENDING],
    totalApproved: result[ServiceStatusList.APPROVED],
    totalRejected: result[ServiceStatusList.REJECTED],
  }
}
