const SHIKI_THEME = 'github-dark';
const SHIKI_LANGUAGES = ['csharp', 'ts', 'tsx', 'python', 'yaml', 'plaintext'] as const;

type ShikiLanguage = (typeof SHIKI_LANGUAGES)[number];

let highlighterPromise: Promise<{ codeToHtml: (code: string, options: { lang: string; theme: string }) => string }> | null =
  null;

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
      getHighlighter?: (options: { theme: string; langs: string[] }) => Promise<{
        codeToHtml: (code: string, options: { lang: string; theme: string }) => string;
      }>;
      createHighlighter?: (options: { themes: string[]; langs: string[] }) => Promise<{
        codeToHtml: (code: string, options: { lang: string; theme: string }) => string;
      }>;
      getSingletonHighlighter?: (options: { themes: string[]; langs: string[] }) => Promise<{
        codeToHtml: (code: string, options: { lang: string; theme: string }) => string;
      }>;
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
