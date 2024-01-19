import mongoose, { Schema } from 'mongoose'
import { IBlog } from './blog.interface'
const blogSchema = new mongoose.Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    tags: [{ type: String, required: true }],
  },
  { timestamps: true },
)

// Create and export the mongoose model
const BlogModel = mongoose.model<IBlog>('blog', blogSchema)

export default BlogModel
