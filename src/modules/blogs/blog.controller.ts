import { Request, Response } from 'express'
import tryCatchAsync from '../../shared/tryCatchAsync'
import sendResponse from '../../shared/sendResponse'
import { BlogService } from './blog.service'
import mongoose from 'mongoose'
import { IBlog } from './blog.interface'

const createBlog = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId
    role: string
  }
  const result = await BlogService.createBlog(loggedUser, req.body)

  sendResponse<IBlog>(res, {
    statusCode: 200,
    success: true,
    message: 'Blog is created successfully',
    data: result,
  })
})

const getAllBlogs = tryCatchAsync(async (_req: Request, res: Response) => {
  const result = await BlogService.getAllBlogs()

  sendResponse<IBlog[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All blogs fetched successfully',
    data: result,
  })
})

export const BlogController = {
  createBlog,
  getAllBlogs,
}
