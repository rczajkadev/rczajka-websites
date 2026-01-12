import { defineField, defineType } from 'sanity';

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'C#', value: 'csharp' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'TSX', value: 'tsx' },
          { title: 'Python', value: 'python' },
          { title: 'YAML', value: 'yaml' },
          { title: 'Plaintext', value: 'plaintext' }
        ]
      }
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string'
    })
  ]
});
