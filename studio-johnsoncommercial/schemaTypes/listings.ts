// schemas/listing.js
import {defineField, defineType} from 'sanity'
import DetailsTableInput from '../components/DetailsTableInput'

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
          { title: 'For Sale/For Lease', value: 'both' },
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
      hidden: true,
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
      name: 'property_types',
      title: 'Property Type(s)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Industrial', value: 'Industrial' },
          { title: 'Land', value: 'Land' },
          { title: 'Medical', value: 'Medical' },
          { title: 'Office', value: 'Office' },
          { title: 'Retail', value: 'Retail' },
          { title: 'Special Purpose', value: 'Special Purpose' },
          { title: 'Residential', value: 'Residential' },
          { title: 'Flex', value: 'Flex' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'pdf',
      title: 'Featured PDF Document',
      type: 'file',
    }),
    defineField({
      name: 'pdf_name',
      title: 'Featured PDF Name (Optional)',
      type: 'string',
      description: 'Download Button Text = "PDF Name"'
    }),
    defineField({
      name: 'pdfs',
      title: 'Additional PDF Documents',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'namedPdf',
          fields: [
            {
              name: 'file',
              title: 'PDF File',
              type: 'file'
            },
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'Download Button Text = "PDF Name"'
            },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'file',
            },
          },
        },
      ],
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
      name: 'social',
      title: 'Social Media Image',
      type: 'image',
      options: {
        hotspot: true
      },
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
      hidden: true
    }),
    defineField({
      name: 'detailsTable',
      title: 'Property Details',
      type: 'object',
      fields: [
        defineField({
          name: 'fields',
          title: 'Table Fields',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'id',
                title: 'Field ID',
                type: 'string',
                readOnly: true
              },
              {
                name: 'displayName',
                title: 'Display Name',
                type: 'string'
              },
              {
                name: 'value',  // This will store the field value directly
                title: 'Field Value',
                type: 'string'
              },
              {
                name: 'isCustom',
                title: 'Is Custom Field',
                type: 'boolean',
                initialValue: false
              }
            ]
          }],
        }),
        defineField({
          name: 'removedFieldIds',
          title: 'Removed Field IDs',
          type: 'array',
          of: [{type: 'string'}],
          hidden: true
        })
      ],
      components: {
        input: DetailsTableInput
      },
      // Start with an empty table by default
      initialValue: {
        fields: [],
        removedFieldIds: []
      }
    })
  ],
  preview: {
    select: {
      title: 'address',
      subtitle: 'listing_type',
      gallery: 'gallery',
    },
    prepare({title, subtitle, gallery}) {
      return {
        title,
        subtitle,
        media: gallery?.[0] || null
      }
    }
  }
});