import { JwtPayload } from 'jsonwebtoken'
import { IBlog } from './blog.interface'
import BlogModel from './blog.model'

const createBlog = async (
  loggedUser: JwtPayload,
  requestPayload: IBlog,
): Promise<IBlog> => {
  const blog = await BlogModel.create({
    ...requestPayload,
    author: loggedUser.userId,
  })

  return blog
}

const getAllBlogs = async (): Promise<IBlog[]> => {
  const blogs = await BlogModel.find({})
  return blogs
}

export const BlogService = {
  createBlog,
  getAllBlogs,
}
