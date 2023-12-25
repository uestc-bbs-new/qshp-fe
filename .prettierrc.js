module.exports = {
  singleQuote: true,
  semi: false,
  trailingComma: 'es5',
  importOrder: ['^react', '^@mui/(.*)$', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
}
