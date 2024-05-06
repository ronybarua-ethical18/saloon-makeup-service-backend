import path from 'path'
import fs from 'fs'
import { Request, Response } from 'express'
import cloudinary from '../../config/cloudinary'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'
import sendResponse from '../../shared/sendResponse'

const uploadFile = async (req: Request, res: Response) => {
  const files = req.files as { [fieldName: string]: Express.Multer.File[] }
  const fileMimeType = files.img[0].mimetype.split('/').at(-1)
  const fileName = files.img[0].filename
  const filePath = path.resolve(__dirname, '../../public/uploads', fileName)

  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    format: fileMimeType,
    folder: 'images',
  })

  if (!uploadResult) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Something went wrong uploading file',
    )
  }

  // delete temp files
  await fs.promises.unlink(filePath)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'File uploaded successfully',
    data: uploadResult.secure_url,
  })
}

export default uploadFile
