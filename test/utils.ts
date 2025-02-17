import type { SidebarItem } from '../src/types'
import path from 'node:path'
import fs from 'fs-extra'
import { getLastSlug } from '../src/utils'

interface Node {
  item: SidebarItem & {
    /**
     * 生成的文件内容
     */
    content?: string

    /**
     * 如果要移除该项，可以设置为 false
     */
    sidebar?: boolean
  }
  parent?: Node['item']
}

function createNode(item: Node['item'], parent?: Node['item']) {
  return { item, parent }
}

function clearExtra(it: Node['item'] | Node['item'][]) {
  if (Array.isArray(it)) {
    it.forEach(clearExtra)
  }
  else {
    ['content'].forEach(k => delete it[k])
    it.items && it.items.forEach(clearExtra)
  }
}

function notEmptyItem(item: Node['item']) {
  return item.items ? !!item.items.length : !!item.content
}

function isDisabledItem(item: Node['item']) {
  return item.sidebar === false
}

function clearEmptyContent<T extends Node['item'] | Node['item'][]>(it: T): T {
  if (Array.isArray(it)) {
    it.forEach(clearEmptyContent)
    return it.filter(i => notEmptyItem(i) && !isDisabledItem(i)) as T
  }
  if (it.items) {
    it.items = clearEmptyContent(it.items)
  }
  return it
}

/**
 * 数据为原地变化
 */
export function generateTestFiles(sidebar: Record<string, Node['item'] | Node['item'][]>, srcDir: string) {
  function createFile(filename: string, base?: string, content = '') {
    fs.writeFileSync(path.join(srcDir, base, `${filename}.md`), content)
  }

  const queue = Object.values(sidebar).flatMap(item => Array.isArray(item) ? item.map(el => createNode(el)) : createNode(item)) as Node[]
  let node: Node | undefined = queue.shift()

  while (node) {
    const { item, parent } = node
    const { items, base, link, content } = item

    if (items && base) {
      queue.push(...items.map(el => createNode(el, item)))
      fs.ensureDirSync(path.join(srcDir, base))

      if (content) {
        createFile('index', base, content)

        // 没有子项，转为普通链接
        if (!items || !items.length) {
          item.link = getLastSlug(item.base)
          delete item.base
          delete item.items
        }
      }
    }
    else {
      createFile(link, parent?.base, content)
    }

    node = queue.shift()
  }

  Object.keys(sidebar).forEach((key) => {
    const it = sidebar[key] = clearEmptyContent(sidebar[key])
    const notEmpty = Array.isArray(it) ? !!it.length : notEmptyItem(it)

    if (!notEmpty) {
      delete sidebar[key]
    }
  })

  Object.values(sidebar).forEach(clearExtra)
}
