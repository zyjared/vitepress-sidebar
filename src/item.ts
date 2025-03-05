import type { DefaultTheme } from 'vitepress'

import matter from 'gray-matter'

import { getLastSlug, parentBase, removeSuffix } from './utils'

export enum EXTRA_ATTRS {
  FRONTMATTER = 'frontmatter',
  GROUP = 'group',
  ORDER = 'order',
  HAS_CONTENT = 'hasContent',
  INDEX = 'index',
}

export interface FrontMatter {
  title?: string
  sidebar?: boolean | 'group' | 'group-collapsed' | 'collapsed'
  order?: number
  date?: string
}

export type Item = DefaultTheme.SidebarItem & {
  items?: Item[]
  [EXTRA_ATTRS.FRONTMATTER]?: FrontMatter
  [EXTRA_ATTRS.HAS_CONTENT]?: boolean
  [EXTRA_ATTRS.GROUP]?: FrontMatter['sidebar']
  [EXTRA_ATTRS.INDEX]?: Item
}

export function clearItemExtraAttrs(item: Item, assgin = false): Item {
  const exclude = [
    EXTRA_ATTRS.FRONTMATTER,
    EXTRA_ATTRS.HAS_CONTENT,
    EXTRA_ATTRS.GROUP,
    EXTRA_ATTRS.INDEX,
  ]

  if (!assgin)
    return assignItem({}, item, exclude)

  exclude.forEach(key => delete item[key])
  return item
}

export function itemFmSidebarIsGroup(item: Item) {
  const sidebar = item[EXTRA_ATTRS.FRONTMATTER]?.sidebar
  return typeof sidebar === 'string' && sidebar.startsWith('group') ? sidebar : false
}

export function isGroupItem(item: Item) {
  return item[EXTRA_ATTRS.GROUP]
}

export function isIndexItem(item: Item) {
  return item.link === 'index'
}

export function isHiddenItem(item: Item) {
  const sidebar = item[EXTRA_ATTRS.FRONTMATTER]?.sidebar
  return sidebar === false
}

export function isInvalidItem(item: Item | any) {
  if (!item || isHiddenItem(item)) {
    return true
  }

  const indexItem = item[EXTRA_ATTRS.INDEX]
  if (!indexItem) {
    return !item[EXTRA_ATTRS.HAS_CONTENT] && !item.items?.length
  }

  return isInvalidItem(indexItem) && !item.items?.length
}

function prepItemFm(item: Item, filepath: string): Item {
  const { content, data } = matter.read(filepath)
  const hasContent = /./.test(content.trim())

  // 没有 fm.title 时, 一级标题作为 fm.title
  if (hasContent && !data.title) {
    const titleMatch = content.match(/^#\s+(.+)/m)
    if (titleMatch) {
      data.title = titleMatch[1].trim()
    }
  }

  return {
    ...item,
    text: data.title || item.text,
    [EXTRA_ATTRS.FRONTMATTER]: data as FrontMatter,
    [EXTRA_ATTRS.HAS_CONTENT]: hasContent,
  }
}

export function buildItem(filepath: string): Item {
  const link = removeSuffix(getLastSlug(filepath))
  const text = link === 'index' ? getLastSlug(parentBase(filepath)) : link
  const item = prepItemFm({ text, link }, filepath)
  return item
}

export function assignItem(dest: Item, src: Item, exclude: string[] = []) {
  Object.keys(src)
    .filter(key => !exclude.includes(key))
    .forEach(key => dest[key] = src[key])

  return dest
}
