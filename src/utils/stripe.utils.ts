export const manipulateLineItem = () => {
  const totalAmount = 1000

  // Create a single line item
  const singleLineItem = {
    price_data: {
      currency: 'eur',
      product_data: {
        name: 'Complete Order',
        description: `The service is about hair cutting`,
        images: ['https://u-send.s3.eu-west-2.amazonaws.com/usend-logo.png'],
        metadata: {
          order_item_count: 5,
        },
      },
      unit_amount: totalAmount,
    },
    quantity: 1,
  }

  return [singleLineItem]
}
