import type { GeneratorOptions } from './generator'
import type { Item } from './item'
import { EXTRA_ATTRS } from './item'

export function defineConfig(options: Partial<GeneratorOptions>) {
  return {
    srcDir: 'docs',
    include: '**/*.md',
    ignore: [
      '**/node_modules/**/*',
      '**/dist/**/*',
      '**/build/**/*',
      '**/public/**/*',
      '**/static/**/*',
    ],
    sortRule(a: Item, b: Item) {
      const afm = a[EXTRA_ATTRS.FRONTMATTER]
      const bfm = b[EXTRA_ATTRS.FRONTMATTER]

      const aIsGroup = !!a[EXTRA_ATTRS.GROUP]
      const bIsGroup = !!b[EXTRA_ATTRS.GROUP]
      if (aIsGroup !== bIsGroup) {
        return bIsGroup ? -1 : 1
      }

      if (afm && bfm) {
        const keys = ['order', 'date']

        for (const key of keys) {
          if (afm[key] !== bfm[key]) {
            return afm[key] < bfm[key] ? -1 : 1
          }
        }
      }

      if (!a.text && !b.text) {
        return 0
      }

      return a.text < b.text ? -1 : 1
    },
    ...options,
  }
}
