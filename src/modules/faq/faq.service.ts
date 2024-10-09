import { IFAQ } from './faq.interface'
import FAQModel from './faq.model'

const createFAQ = async (requestPayload: IFAQ): Promise<IFAQ> => {
  const faq = await FAQModel.create({
    ...requestPayload,
  })

  return faq
}

const getAllFaqs = async (): Promise<IFAQ[]> => {
  const faqs = await FAQModel.find({})
  return faqs
}

export const FAQService = {
  createFAQ,
  getAllFaqs,
}
