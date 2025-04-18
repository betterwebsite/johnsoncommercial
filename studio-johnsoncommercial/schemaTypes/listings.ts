// schemas/listing.js
import {defineField, defineType} from 'sanity'

export const listingType = defineType({
  name: 'listing',
  title: 'Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'listing_type',
      title: 'Listing Type',
      type: 'string',
      options: {
        list: [
          { title: 'For Sale', value: 'sale' },
          { title: 'For Lease', value: 'lease' },
          { title: 'Closed', value: 'closed' },
          { title: 'Under Contract', value: 'under_contract' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'sale',
    }),
    defineField({
      name: 'property_type',
      title: 'Property Type',
      type: 'string',
      options: {
        list: [
          { title: 'Industrial', value: 'Industrial' },
          { title: 'Land', value: 'Land' },
          { title: 'Medical', value: 'Medical' },
          { title: 'Office', value: 'Office' },
          { title: 'Retail', value: 'Retail' },
          { title: 'Special Purpose', value: 'Special Purpose' },
          { title: 'Residential', value: 'Residential' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'Industrial',
    }),
    defineField({
      name: 'pdf',
      title: 'PDF Document',
      type: 'file',
    }),
    defineField({
      name: 'buildings',
      title: 'Buildings',
      type: 'array',
      of: [{type: 'building'}],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'price',
    }),
    defineField({
      name: 'misc',
      title: 'Miscellaneous Information',
      type: 'misc',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'location',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'agent_name',
      title: 'Agent Name',
      type: 'string',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'sections',
      title: 'Additional Content Sections',
      type: 'array',
      of: [{type: 'contentSection'}],
    }),
  ],
  preview: {
    select: {
      title: 'address',
      subtitle: 'property_type',
      media: 'mainImage',
    },
  },
});