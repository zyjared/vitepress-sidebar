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

      // 分组优先
      const aIsGroup = !!a[EXTRA_ATTRS.GROUP]
      const bIsGroup = !!b[EXTRA_ATTRS.GROUP]
      if (aIsGroup !== bIsGroup) {
        return bIsGroup ? -1 : 1
      }

      // 按优先级比较 frontmatter
      const priorities = ['order', 'date']
      for (const key of priorities) {
        const aValue = afm?.[key]
        const bValue = bfm?.[key]

        // 如果两者之中只有一个有值，有值的优先
        if (aValue !== undefined || bValue !== undefined) {
          if (aValue === undefined)
            return 1
          if (bValue === undefined)
            return -1
          if (aValue !== bValue)
            return aValue < bValue ? -1 : 1
        }
      }

      // 文本排序
      return a.text?.localeCompare(b.text ?? '') ?? 0
    },
    ...options,
  }
}
