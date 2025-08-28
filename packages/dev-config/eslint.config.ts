import complete from '@voder/dev-config/eslint';

export default [
  ...complete,
  { ignores: ['dist/'] },
];
