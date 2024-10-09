import { Request, Response, NextFunction, RequestHandler } from 'express'

const tryCatchAsync =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
      console.log('from global error', err)
      next(err)
    })
  }

export default tryCatchAsync
