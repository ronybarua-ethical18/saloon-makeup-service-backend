import express, { Router } from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { UserRoutes } from '../modules/user/user.route'

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
  {
    path: '/users',
    route: UserRoutes,
  },
]

routeList.forEach(route => {
  router.use(route.path, route.route)
})

export default router
