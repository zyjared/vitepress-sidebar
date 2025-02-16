import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  typescript: true,
  vue: true,
}, {
  rules: {
    'ts/explicit-function-return-type': 'off',
  },
})
