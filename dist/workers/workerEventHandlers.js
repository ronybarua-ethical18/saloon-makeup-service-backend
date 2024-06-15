'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.handleError = exports.handleMessage = void 0
/* eslint-disable @typescript-eslint/no-explicit-any */
// Function to handle worker messages
const handleMessage = res => {
  return result => {
    res.send(`Task completed with result: ${result}`)
  }
}
exports.handleMessage = handleMessage
// Function to handle worker errors
const handleError = res => {
  return error => {
    res.status(500).send(`Worker error: ${error.message}`)
  }
}
exports.handleError = handleError
