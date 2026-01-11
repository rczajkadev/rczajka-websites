import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { toPlainText } from '@portabletext/toolkit';
import type { PortableTextBlock } from '@portabletext/types';
import katex from 'katex';
import { buildHeadingId } from '@/lib/slug';
import { highlightCode } from '@/lib/shiki';
import { urlForImage } from './image';
import type { PortableTextValue } from './types';

type CodeBlockValue = {
  language?: string;
  code?: string;
  filename?: string;
  codeHtml?: string;
};

type MathBlockValue = {
  latex?: string;
  displayMode?: boolean;
};

type ImageValue = {
  asset?: { _ref?: string };
  alt?: string;
};

const getImageDimensions = (ref?: string) => {
  if (!ref) {
    return null;
  }

  const match = ref.match(/-(\d+)x(\d+)-/);
  if (!match) {
    return null;
  }

  return { width: Number(match[1]), height: Number(match[2]) };
};

const CodeBlock = ({ value }: { value: CodeBlockValue }) => {
  if (!value?.code) {
    return null;
  }

  const highlighted = value.codeHtml;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70">
      {value.filename ? (
        <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
          {value.filename}
        </div>
      ) : null}
      {highlighted ? (
        <div
          className="overflow-x-auto text-sm leading-6 [&_pre]:bg-transparent [&_pre]:p-5"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <pre className="overflow-x-auto p-5 text-sm leading-6 text-neutral-200">
          <code>{value.code}</code>
        </pre>
      )}
    </div>
  );
};

const MathBlock = ({ value }: { value: MathBlockValue }) => {
  if (!value?.latex) {
    return null;
  }

  const html = katex.renderToString(value.latex, {
    displayMode: value.displayMode ?? true,
    throwOnError: false
  });

  return (
    <div
      className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900/70 p-4 text-neutral-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const SanityImage = ({ value }: { value: ImageValue }) => {
  if (!value?.asset?._ref) {
    return null;
  }

  const dimensions = getImageDimensions(value.asset._ref);
  const width = dimensions?.width ?? 1200;
  const height = dimensions?.height ?? 800;
  const src = urlForImage(value)
    .width(width)
    .height(height)
    .fit('max')
    .auto('format')
    .url();

  return (
    <figure className="my-8">
      <Image
        alt={value.alt ?? ''}
        className="rounded-2xl border border-white/10"
        height={height}
        sizes="(min-width: 1024px) 720px, 100vw"
        src={src}
        width={width}
      />
      {value.alt ? (
        <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
          {value.alt}
        </figcaption>
      ) : null}
    </figure>
  );
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="my-4 text-base leading-7 text-neutral-200">{children}</p>
    ),
    h2: ({ children, value }) => {
      const text = toPlainText([value as PortableTextBlock]);
      const id = buildHeadingId(text, (value as PortableTextBlock)?._key);
      return (
        <h2 id={id} className="mt-12 scroll-mt-28 text-2xl font-semibold">
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const text = toPlainText([value as PortableTextBlock]);
      const id = buildHeadingId(text, (value as PortableTextBlock)?._key);
      return (
        <h3 id={id} className="mt-10 scroll-mt-28 text-xl font-semibold text-neutral-100">
          {children}
        </h3>
      );
    }
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-neutral-200">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-neutral-200">{children}</ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li className="text-base leading-7">{children}</li>,
    number: ({ children }) => <li className="text-base leading-7">{children}</li>
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-neutral-800/80 px-1.5 py-0.5 text-sm text-neutral-100">
        {children}
      </code>
    )
  },
  types: {
    codeBlock: CodeBlock,
    mathBlock: MathBlock,
    image: SanityImage
  }
};

export const PortableTextRenderer = ({ value }: { value: PortableTextValue }) => {
  return <PortableText value={value as PortableTextBlock[]} components={components} />;
};

export const addCodeHighlights = async (blocks: PortableTextValue = []) => {
  return Promise.all(
    blocks.map(async (block) => {
      if (block._type !== 'codeBlock') {
        return block;
      }

      const value = block as CodeBlockValue & PortableTextBlock;
      const codeHtml = await highlightCode(value.code ?? '', value.language);
      return { ...value, codeHtml };
    })
  );
};
