import {defineField, defineType} from 'sanity'
import CurrencyInput from '../components/CurrencyInput'


export const priceType = defineType({
  name: 'price',
  title: 'Price',
  type: 'object',
  fields: [
    defineField({
      name: 'sale_price',
      title: 'Sale Price',
      type: 'string',
      description: 'Please format this with "$" and ","',
    }),
    defineField({
      name: 'lease_rate',
      title: 'Lease Rate',
      type: 'string',
      description: 'Please format this with "$" and "/SF/Mo/Yr" example: $150/Sf/Mo'
    }),
    defineField({
      name: 'price_per',
      title: 'Price Per SF',
      type: 'string',
      description: 'Please format this with "$" and ","',
    }),
    defineField({
      name: 'nnn_rate',
      title: 'NNN Rate',
      type: 'string',
      description: 'Please format this with "$" and ","',
    }),
    defineField({
      name: 'cam_fee',
      title: 'Cam Fee',
      type: 'string',
      description: 'Please format this with "$" and ","',
    }),
  ],
});