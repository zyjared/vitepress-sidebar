import type { DefaultTheme } from 'vitepress'
import type { Item } from './item'
import path from 'node:path'
import { globSync } from 'tinyglobby'
import { buildItem, clearItemExtraAttrs, EXTRA_ATTRS, isGroupItem, isIndexItem, isInvalidItem, itemFmSidebarIsGroup } from './item'
import { getLastSlug, parentBase, removeExtraSlash } from './utils'

export interface GeneratorOptions {
  srcDir: string
  include: string | string[]
  ignore: string | string[]
  sortRule: (a: Item, b: Item) => number
}

export class Generator {
  data: Record<string, Item>
  files: string[]
  srcDir: string
  sortRule: (a: Item, b: Item) => number

  constructor(options: GeneratorOptions) {
    const { srcDir, include, ignore, sortRule } = options

    this.data = {}
    this.sortRule = sortRule
    this.srcDir = `${path.resolve(srcDir).split(path.sep).join('/')}/`
    this.files = globSync({
      cwd: srcDir,
      patterns: include,
      ignore,
      onlyFiles: true,
    })
  }

  withBase(filepath: string) {
    return this.srcDir + filepath
  }

  ensureBaseItem(base: string) {
    let baseItem = this.data[base]
    if (!baseItem) {
      baseItem = this.data[base] = {
        text: getLastSlug(base),
        base,
        items: [],
        [EXTRA_ATTRS.GROUP]: base !== '/',
      }
    }

    return baseItem
  }

  /**
   * 将 index 数据绑定到所属文件夹
   */
  processIndexItem(base: string, item: Item) {
    const baseItem = this.ensureBaseItem(base)
    baseItem[EXTRA_ATTRS.INDEX] = item

    const isGroup = itemFmSidebarIsGroup(item)

    if (isGroup) {
      baseItem[EXTRA_ATTRS.GROUP] = isGroup
      baseItem.collapsed = isGroup.endsWith('collapsed')
    }
    else {
      baseItem[EXTRA_ATTRS.GROUP] = false
    }

    baseItem.text = item.text
    baseItem.link = item.link
  }

  addItem(filepath: string) {
    const base = parentBase(filepath)
    const item = buildItem(this.withBase(filepath))

    if (isIndexItem(item)) {
      this.processIndexItem(base, item)
      return
    }

    if (isInvalidItem(item))
      return

    const baseItem = this.ensureBaseItem(base)
    baseItem.items.push(item)
  }

  reset() {
    this.data = {}
    this.files.forEach(filepath => this.addItem(filepath))
  }

  tryCopyBaseIndex(base: string) {
    const item = this.data[base]
    if (isGroupItem(item)) {
      return
    }

    const indexItem = item[EXTRA_ATTRS.INDEX]
    if (!indexItem)
      return

    const sidebar = indexItem[EXTRA_ATTRS.FRONTMATTER]?.sidebar
    if (sidebar !== true)
      return

    const targetItem = this.ensureBaseItem(parentBase(base))
    targetItem.items.push({
      ...item[EXTRA_ATTRS.INDEX],
      link: removeExtraSlash(`${getLastSlug(base)}/index`),
    })
  }

  tryMoveBaseItem(base: string) {
    const item = this.data[base]
    if (!isGroupItem(item))
      return

    const targetItem = this.ensureBaseItem(parentBase(base))
    targetItem.items.push(item)
  }

  tryGenerate() {
    this.reset()
    const stack = new BaseStack(Object.keys(this.data))
    const clearKeys = new Set<string>()

    while (stack.size) {
      const current = stack.pop()
      const item = this.data[current]
      if (isInvalidItem(item)) {
        clearKeys.add(current)
        continue
      }

      item.items.sort(this.sortRule)
      item.items = item.items.map(it => clearItemExtraAttrs(it))

      const pBase = parentBase(current)
      if (!this.data[pBase]) {
        stack.push(pBase)
      }

      if (item[EXTRA_ATTRS.GROUP]) {
        clearKeys.add(current)
      }

      if (current === '/') {
        continue
      }

      this.tryMoveBaseItem(current)
      this.tryCopyBaseIndex(current)
    }

    clearKeys.forEach(key => this.data[key] = null)
  }

  generate() {
    this.tryGenerate()
    const sidebar: DefaultTheme.Sidebar = {}

    Object.keys(this.data).forEach((key) => {
      if (this.data[key]) {
        const { items, base } = this.data[key]
        if (items?.length) {
          sidebar[key] = { items, base }
        }
      }
    })

    return sidebar
  }
}

class BaseStack {
  bases: string[]
  size: number
  constructor(bases: string[]) {
    this.bases = bases.sort((a, b) => a < b ? -1 : 1)
    this.size = bases.length
  }

  pop() {
    this.size--
    return this.bases.pop()
  }

  push(base: string) {
    let pos: number = -1
    for (let i = this.bases.length - 1; i >= 0; i--) {
      if (base === this.bases[i]) {
        return
      }

      if (!base.startsWith(this.bases[i])) {
        break
      }

      pos = i
    }

    if (pos === -1) {
      this.bases.push(base)
    }
    else {
      this.bases.splice(pos, 0, base)
    }

    this.size++
  }
}
