// worker.ts
import { Job, Worker } from 'bullmq'
import redis from '../../config/redis'

export function paymentDispatchQueueWorker(): void {
  const worker = new Worker(
    'paymentDispatchQueue',
    async (job: Job) => {
      await new Promise(resolve => setTimeout(resolve, 5000))

      console.log('job', job)
    },
    {
      connection: {
        host: redis.REDIS_URI,
        port: redis.REDIS_PORT,
      },
      concurrency: 1,
      autorun: true,
    },
  )

  worker.on('completed', async (job: Job) => {
    console.log('Completed job with order id: ' + job.id)
  })

  worker.on('failed', async (job: Job | undefined) => {
    if (job) {
      console.log('failed job', job.id)
    } else {
      console.debug('Job failed, but no job information available.')
    }
  })
}
