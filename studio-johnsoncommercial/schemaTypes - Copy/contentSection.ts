import {defineField, defineType} from 'sanity'

export const contentSectionType = defineType({
  name: 'contentSection',
  title: 'Content Section',
  type: 'object',
  fields: [
    defineField({
      name: 'section_name',
      title: 'Section Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'section_description',
      title: 'Section Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
  ],
});