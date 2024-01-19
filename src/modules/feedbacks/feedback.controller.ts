import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import { FeedbackService } from './feedback.service'
import mongoose from 'mongoose'
import { IFeedback } from './feedback.interface'

const createFeedback = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const result = await FeedbackService.createFeedback(loggedUser, req.body)

  sendResponse<IFeedback>(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback is created successfully',
    data: result,
  })
})

const getAllFeedbacks = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.getAllFeedbacks()

  sendResponse<IFeedback[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All feedbacks fetched successfully',
    data: result,
  })
})

export const FeedbackController = {
  createFeedback,
  getAllFeedbacks,
}
