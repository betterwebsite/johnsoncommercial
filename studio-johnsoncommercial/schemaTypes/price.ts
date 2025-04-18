import {defineField, defineType} from 'sanity'

export const priceType = defineType({
  name: 'price',
  title: 'Price',
  type: 'object',
  fields: [
    defineField({
      name: 'sale_price',
      title: 'Sale Price',
      type: 'number',
      description: 'Leave this blank for "Lease", use "Lease Rate" below instead',
    }),
    defineField({
      name: 'lease_rate',
      title: 'Lease Rate',
      type: 'string',
      description: 'Please format this with "$" and "/SF/Mo/Yr" example: $150/Sf/Mo',
    }),
    defineField({
      name: 'price_per',
      title: 'Price Per SF',
      type: 'number',
    }),
  ],
});