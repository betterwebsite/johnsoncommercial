import {defineField, defineType} from 'sanity'
import FormattedFloatInput from '../components/FormattedFloatInput'

export const buildingType = defineType({
  name: 'building',
  title: 'Building',
  type: 'object',
  fields: [
    defineField({
      name: 'square_feet',
      title: 'Square Feet',
      type: 'string',
      components: {
        input: FormattedFloatInput
      }
    }),
    defineField({
      name: 'lot_size',
      title: 'Size',
      type: 'string',
      components: {
        input: FormattedFloatInput
      }
    }),
    defineField({
      name: 'year_built',
      title: 'Year Built',
      type: 'string',
    }),
  ],
});