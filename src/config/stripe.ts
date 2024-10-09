import Stripe from 'stripe'
import config from '.'

export const stripe = new Stripe(`${config.stripe.stripe_secret_key}`, {
  apiVersion: '2024-06-20',
})
