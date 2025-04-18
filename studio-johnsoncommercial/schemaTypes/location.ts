import {defineField, defineType} from 'sanity'

export const locationType = defineType({
  name: 'location',
  title: 'Location',
  type: 'object',
  fields: [
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      initialValue: 'OK',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'zipcode',
      title: 'Zipcode',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
  ],
});