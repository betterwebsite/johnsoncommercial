import {defineField, defineType} from 'sanity'

export const miscType = defineType({
  name: 'misc',
  title: 'Miscellaneous Information',
  type: 'object',
  fields: [
    defineField({
      name: 'traffic',
      title: 'Traffic Count',
      type: 'number',
    }),
    defineField({
      name: 'caprate',
      title: 'Cap Rate',
      type: 'number',
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
