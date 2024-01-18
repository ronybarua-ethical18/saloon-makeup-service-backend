import express, { Router } from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { UserRoutes } from '../modules/user/user.route'
import { SaloonServiceRoutes } from '../modules/services/service.route'
import { ShopRoutes } from '../modules/shop/shop.route'
import { BookingRoutes } from '../modules/bookings/booking.route'

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
  {
    path: '/services',
    route: SaloonServiceRoutes,
  },
  {
    path: '/shops',
    route: ShopRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
]

routeList.forEach(route => {
  router.use(route.path, route.route)
})

export default router
