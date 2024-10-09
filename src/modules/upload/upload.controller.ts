import { Request, Response } from 'express'
import cloudinary from '../../config/cloudinary'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'
import sendResponse from '../../shared/sendResponse'

const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded')
    }

    const { originalname, path, mimetype } = req.file

    const uploadResult = await cloudinary.uploader.upload(path, {
      folder: 'images',
      public_id: originalname,
      resource_type: 'auto',
      format: mimetype.split('/').at(-1),
    })

    if (!uploadResult) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Something went wrong uploading file',
      )
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'File uploaded successfully',
      data: uploadResult.secure_url,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Failed to upload file',
      data: error,
    })
  }
}

export default uploadFile
;``
