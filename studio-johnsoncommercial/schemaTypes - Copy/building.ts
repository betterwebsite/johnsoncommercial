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
      description: 'This is Square Feet used for Filtering on Map. Please format this with ","',
    }),
    defineField({
      name: 'lot_size',
      title: 'Size',
      type: 'string',
      description: 'This is "Size:" Please format this with ","',
    }),
    defineField({
      name: 'year_built',
      title: 'Year Built',
      type: 'string',
    }),
  ],
/* ------------------------------------------------------------------ */
  /*  Nice, “Price-style” preview inside the array list                  */
  /* ------------------------------------------------------------------ */
  preview: {
    select: {
      sqft: 'square_feet',
      lot:  'lot_size',
      year: 'year_built',
    },
    prepare({sqft, lot, year}) {
      const prettify = (v?: string) => {
        if (!v) return undefined
        const n = parseFloat(v.replace(/,/g, ''))
        return isNaN(n) ? v : n.toLocaleString()
      }

      return {
        title: prettify(sqft) ? `SF: ${prettify(sqft)}` : 'New building',
        subtitle: [
          lot   ? `Size: ${prettify(lot)}` : null,
          year  ? `YearBuilt: ${year}`            : null,
        ].filter(Boolean).join(' • '),
      }
    },
  },
})