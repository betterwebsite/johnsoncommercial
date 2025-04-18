import {defineField, defineType} from 'sanity'

export const buildingType = defineType({
  name: 'building',
  title: 'Building',
  type: 'object',
  fields: [
    defineField({
      name: 'square_feet',
      title: 'Square Feet',
      type: 'number',
    }),
    defineField({
      name: 'lot_acres',
      title: 'Lot Size (Acres)',
      type: 'number',
    }),
    defineField({
      name: 'year_built',
      title: 'Year Built',
      type: 'number',
    }),
  ],
});