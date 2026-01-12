import { defineField, defineType } from 'sanity';

export const mathBlock = defineType({
  name: 'mathBlock',
  title: 'Math Block',
  type: 'object',
  fields: [
    defineField({
      name: 'latex',
      title: 'LaTeX',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'displayMode',
      title: 'Display mode',
      type: 'boolean',
      initialValue: true
    })
  ]
});
