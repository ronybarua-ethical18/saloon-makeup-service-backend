import express, { Router } from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'

const router = express.Router()

type IRoute = {
  path: string
  route: Router
}

const routeList: IRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

routeList.forEach(route => {
  router.use(route.path, route.route)
})

export default router
