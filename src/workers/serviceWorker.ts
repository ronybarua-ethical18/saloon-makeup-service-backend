/* eslint-disable @typescript-eslint/no-explicit-any */
// worker-optimized.ts
import { parentPort } from 'worker_threads'
import { ServiceModel } from '../modules/services/service.model'
import config from '../config'
import mongoose from 'mongoose'
import app from '../app'

function getMongoUrl() {
  if (config.env === 'development') {
    return config.database_url
  } else {
    return config.production_db_url
  }
}

const url: string = getMongoUrl() || ''

//server connect
mongoose.connect(url).then(() => {
  console.log('<===== Database Connected Successfully Yahoo! =====>')
  app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`)
  })
})

// The function to be executed in the worker thread
async function getAllServices(): Promise<any> {
  const total: any = await ServiceModel.countDocuments()
  return total
}

// Listen for messages from the main thread
parentPort?.on('message', async message => {
  try {
    console.log(message)
    const result = await getAllServices()
    parentPort?.postMessage(result)
  } catch (error: any) {
    console.log('error from worker thread', error)
    parentPort?.postMessage({ error: error.message })
  }
})
