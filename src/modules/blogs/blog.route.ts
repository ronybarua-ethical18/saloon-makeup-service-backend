import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import { BlogController } from './blog.controller'
import validateRequest from '../../middlewares/validateRequest'
import { BlogValidation } from './blog.validation'
const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.createBlog,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BlogController.getAllBlogs,
)

export const BlogRoutes = router
