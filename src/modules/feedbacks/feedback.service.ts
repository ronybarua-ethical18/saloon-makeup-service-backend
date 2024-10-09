import { IFeedback } from './feedback.interface'
import FeedBackModel from './feedback.model'
import { JwtPayload } from 'jsonwebtoken'

const createFeedback = async (
  loggedUser: JwtPayload,
  requestPayload: IFeedback,
): Promise<IFeedback> => {
  const feedback = await FeedBackModel.create({
    ...requestPayload,
    user: loggedUser.userId,
  })

  return feedback
}

const getAllFeedbacks = async (): Promise<IFeedback[]> => {
  const feedbacks = await FeedBackModel.find({}).populate('user', '-password')
  return feedbacks
}

export const FeedbackService = {
  createFeedback,
  getAllFeedbacks,
}
