// worker.ts
import { Job, Worker } from 'bullmq'
import redis from '../../config/redis'
import { emailDispatch } from '../utils/email.utils'

export function emailDispatchQueueWorker(): void {
  const worker = new Worker(
    'emailDispatchQueue',
    async (job: Job) => {
      await new Promise(resolve => setTimeout(resolve, 5000))
      const {
        subject,
        payload,
        template,
        emailType,
        mailTrackerPayload,
        targetEmail,
      } = job.data.emailPayload

      await emailDispatch(
        targetEmail,
        payload,
        template,
        subject,
        emailType,
        mailTrackerPayload,
      )

      console.log('email payload', job?.data?.emailPayload)
      // await paymentDisbursed(job?.data?.booking)
      // await emailDispatch()
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
      console.log('failed job with booking id:', job.data?.booking?.bookingId)
    } else {
      console.debug('Job failed, but no job information available.')
    }
  })
}
