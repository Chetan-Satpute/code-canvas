/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,

  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  importOrder: [
    '^react(-dom(/.*)?)?$',
    '<THIRD_PARTY_MODULES>',
    '^#.*',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
