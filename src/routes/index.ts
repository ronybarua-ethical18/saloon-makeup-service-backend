import express, { Router } from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { UserRoutes } from '../modules/user/user.route'
import { SaloonServiceRoutes } from '../modules/services/service.route'
import { ShopRoutes } from '../modules/shop/shop.route'
import { BookingRoutes } from '../modules/bookings/booking.route'
import { FeedbackRoutes } from '../modules/feedbacks/feedback.route'
import { FAQRoutes } from '../modules/faq/faq.route'

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
  {
    path: '/feedbacks',
    route: FeedbackRoutes,
  },
  {
    path: '/faqs',
    route: FAQRoutes,
  },
]

routeList.forEach(route => {
  router.use(route.path, route.route)
})

export default router
