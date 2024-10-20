// queue.ts
import { Job, Queue } from 'bullmq'
import { redisClient } from '../../config/redis'
import { paymentDispatchQueueWorker } from './paymentQueueWorker'

export const paymentDispatchQueue = new Queue('paymentDispatchQueue', {
  connection: redisClient
})

const DEFAULT_CONFIG = {
  attempts:1,
  removeOnComplete: true,
  removeOnFail: true,
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

paymentDispatchQueueWorker()
