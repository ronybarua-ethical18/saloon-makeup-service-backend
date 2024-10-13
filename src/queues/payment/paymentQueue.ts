// queue.ts
import { Job, Queue } from 'bullmq'
import redis from '../../config/redis'

export const paymentDispatchQueue = new Queue('paymentDispatchQueue', {
  connection: {
    host: redis.REDIS_URI,
    port: redis.REDIS_PORT,
  },
})

const DEFAULT_CONFIG = {
  attempts:2,
  removeOnComplete: false,
  removeOnFail: false,
  // delay: 5000,
}

export async function addJobToPaymentDispatchQueue<T>(
  data: T
): Promise<Job<T>> {
  // console.log("paypal data", data);
  return paymentDispatchQueue.add(
    'job',
    { booking: data },
    DEFAULT_CONFIG,
  )
}
