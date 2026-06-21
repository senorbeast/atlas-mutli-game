import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

export default [
  ...nextVitals,
  prettier,
  {
    rules: {
      'no-var': 'error',
      'no-console': 'off',
      'import/prefer-default-export': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'public/**', 'src/protocol/generated/**', 'src/templates/**', 'next-env.d.ts'],
  },
]
