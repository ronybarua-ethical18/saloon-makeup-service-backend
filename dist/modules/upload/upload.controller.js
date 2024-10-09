'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const cloudinary_1 = __importDefault(require('../../config/cloudinary'))
const ApiError_1 = __importDefault(require('../../errors/ApiError'))
const http_status_1 = __importDefault(require('http-status'))
const sendResponse_1 = __importDefault(require('../../shared/sendResponse'))
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        'No file uploaded',
      )
    }
    const { originalname, path, mimetype } = req.file
    const uploadResult = await cloudinary_1.default.uploader.upload(path, {
      folder: 'images',
      public_id: originalname,
      resource_type: 'auto',
      format: mimetype.split('/').at(-1),
    })
    if (!uploadResult) {
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        'Something went wrong uploading file',
      )
    }
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'File uploaded successfully',
      data: uploadResult.secure_url,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Failed to upload file',
      data: error,
    })
  }
}
exports.default = uploadFile
;``
