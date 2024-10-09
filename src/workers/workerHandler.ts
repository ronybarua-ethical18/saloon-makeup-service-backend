/* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker } from 'worker_threads'
import path from 'path'

export const createWorker = () => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, './serviceWorker.ts'), {
      execArgv: ['-r', 'ts-node/register'],
      workerData: { thread_count: 2 },
    })

    // send a message from the main thread to the worker thread  if necessary
    // worker.postMessage({ queryPayload, sortCondition, skip, limit });

    worker.on('message', data => {
      resolve(data)
    })

    worker.on('error', err => {
      reject(`An error occured ${err}`)
    })

    worker.on('exit', code => {
      if (code !== 0) {
        reject(`Worker stopped with exit code ${code}`)
      }
    })
  })
}
