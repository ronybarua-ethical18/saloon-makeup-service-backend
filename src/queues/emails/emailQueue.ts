// queue.ts
import { Job, Queue } from 'bullmq'
import { redisClient } from '../../config/redis'
import { emailDispatchQueueWorker } from './emailQueueWorker'

export const emailDispatchQueue = new Queue('emailDispatchQueue', {
  connection: redisClient
})

const DEFAULT_CONFIG = {
  attempts:1,
  removeOnComplete: true,
  removeOnFail: true,
  // delay: 5000,
}

export async function addJobToEmailDispatchQueue<T>(
  data: T
): Promise<Job<T>> {
  // console.log("paypal data", data);
  return emailDispatchQueue.add(
    'job',
    { emailPayload: data },
    DEFAULT_CONFIG,
  )
}

emailDispatchQueueWorker()
