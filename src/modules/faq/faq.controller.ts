import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import { FAQService } from './faq.service'
import { IFAQ } from './faq.interface'

const createFAQ = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await FAQService.createFAQ(req.body)

  sendResponse<IFAQ>(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ is created successfully',
    data: result,
  })
})

const getAllFaqs = tryCatchAsync(async (_req: Request, res: Response) => {
  const result = await FAQService.getAllFaqs()

  sendResponse<IFAQ[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All faqs fetched successfully',
    data: result,
  })
})

export const FAQController = {
  createFAQ,
  getAllFaqs,
}
