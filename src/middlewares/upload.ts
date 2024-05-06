import path from 'path'
import multer from 'multer'

const upload = multer({
  dest: path.resolve(__dirname, '../public/uploads'),
  limits: { fileSize: 3e7 },
})

export default upload
