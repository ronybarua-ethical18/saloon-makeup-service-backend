/* eslint-disable @typescript-eslint/no-explicit-any */
// Function to handle worker messages
export const handleMessage = (res: any) => {
  return (result: any) => {
    res.send(`Task completed with result: ${result}`)
  }
}

// Function to handle worker errors
export const handleError = (res: any) => {
  return (error: any) => {
    res.status(500).send(`Worker error: ${error.message}`)
  }
}
