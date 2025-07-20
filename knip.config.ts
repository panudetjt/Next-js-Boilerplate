import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: [
    'unlighthouse.config.ts',
    'src/libs/i18n.ts',
    'src/types/i18n.ts',
    'tests/**/*.ts',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    '@commitlint/types',
    '@clerk/types',
    'conventional-changelog-conventionalcommits',
    'vite',
    'glob',
  ],
  // Binaries to ignore during analysis
  ignoreBinaries: [
    'production', // False positive raised with dotenv-cli
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
