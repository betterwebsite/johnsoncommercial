import {defineField, defineType} from 'sanity'
import FlexibleNumberInput from '../components/FlexibleNumberInput'

export const miscType = defineType({
  name: 'misc',
  title: 'Miscellaneous Information',
  type: 'object',
  fields: [
    defineField({
      name: 'traffic',
      title: 'Traffic Count',
      type: 'string',
    }),
    defineField({
      name: 'caprate',
      title: 'CAP Rate',
      type: 'string'
    }),
    defineField({
      name: 'zoning',
      title: 'Zoning',
      type: 'string',
    }),
    defineField({
      name: 'parcelid',
      title: 'Parcel ID',
      type: 'string',
    }),
  ],
});
