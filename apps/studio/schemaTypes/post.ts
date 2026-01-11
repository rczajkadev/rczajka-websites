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

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated at',
      type: 'datetime'
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'draft',
      title: 'Draft',
      type: 'boolean',
      initialValue: true,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' }
          ]
        },
        { type: 'codeBlock' },
        { type: 'mathBlock' },
        {
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Optional, but recommended for accessibility.'
            })
          ]
        }
      ],
      validation: (Rule) => Rule.required()
    })
  ]
});
