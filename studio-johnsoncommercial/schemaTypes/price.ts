import {defineField, defineType} from 'sanity'
import CurrencyInput from '../components/CurrencyInput'
import CurrencyInputRate from '../components/CurrencyInputRate'


export const priceType = defineType({
  name: 'price',
  title: 'Price',
  type: 'object',
  fields: [
    defineField({
      name: 'sale_price',
      title: 'Sale Price',
      type: 'string',
      description: 'Leave this blank for "Lease", use "Lease Rate" below instead',
      components: {
        input: CurrencyInput
      }
    }),
    defineField({
      name: 'lease_rate',
      title: 'Lease Rate',
      type: 'string',
      description: 'Please format this with "$" and "/SF/Mo/Yr" example: $150/Sf/Mo',
      components: {
        input: CurrencyInputRate
      }
    }),
    defineField({
      name: 'price_per',
      title: 'Price Per SF',
      type: 'string',
      components: {
        input: CurrencyInput
      }
    }),
  ],
});