const SHIKI_THEME = 'github-dark';
const SHIKI_LANGUAGES = ['csharp', 'ts', 'tsx', 'python', 'yaml', 'plaintext'] as const;

type ShikiLanguage = (typeof SHIKI_LANGUAGES)[number];
type ShikiSelector = { theme: string; langs: string[] };
type ShikiOptions  = { themes: string[]; langs: string[] };

type ShikiHighlighter = {
  codeToHtml: (code: string, options: { lang: string; theme: string }) => string;
};

let highlighterPromise: Promise<ShikiHighlighter> | null = null;

const languageMap: Record<string, ShikiLanguage> = {
  csharp: 'csharp',
  'c#': 'csharp',
  cs: 'csharp',
  typescript: 'ts',
  ts: 'ts',
  tsx: 'tsx',
  javascript: 'ts',
  js: 'ts',
  python: 'python',
  py: 'python',
  yaml: 'yaml',
  yml: 'yaml',
  text: 'plaintext',
  plaintext: 'plaintext'
};

const resolveLanguage = (language?: string) => {
  const defaultLanguage = 'plaintext';
  return language ? languageMap[language.toLowerCase()] ?? defaultLanguage : defaultLanguage;
};

const loadHighlighter = async () => {
  if (highlighterPromise) {
    return highlighterPromise;
  }

  highlighterPromise = (async () => {
    const shiki = (await import('shiki')) as {
      getHighlighter?: (options: ShikiSelector) => Promise<ShikiHighlighter>;
      createHighlighter?: (options: ShikiOptions) => Promise<ShikiHighlighter>;
      getSingletonHighlighter?: (options: ShikiOptions) => Promise<ShikiHighlighter>;
    };

    if (shiki.getSingletonHighlighter) {
      return shiki.getSingletonHighlighter({
        themes: [SHIKI_THEME],
        langs: [...SHIKI_LANGUAGES]
      });
    }

    if (shiki.createHighlighter) {
      return shiki.createHighlighter({
        themes: [SHIKI_THEME],
        langs: [...SHIKI_LANGUAGES]
      });
    }

    if (!shiki.getHighlighter) {
      throw new Error('Shiki highlighter API not available.');
    }

    return shiki.getHighlighter({
      theme: SHIKI_THEME,
      langs: [...SHIKI_LANGUAGES]
    });
  })();

  return highlighterPromise;
};

export const highlightCode = async (code: string, language?: string) => {
  const highlighter = await loadHighlighter();
  const lang = resolveLanguage(language);
  return highlighter.codeToHtml(code ?? '', { lang, theme: SHIKI_THEME });
};
