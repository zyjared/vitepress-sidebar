import type { SidebarItem, SidebarMulti } from '../types'
import { getLastSlug, normalizeBase } from '../utils'
import { isItemArray, isNestedBase } from './types'

export interface FormatOptions {
  /**
   * 根目录
   */
  root?: string

  /**
   * base 是否需要嵌套处理
   *
   * @default true
   */
  nest?: boolean

  /**
   * 是否推断 text
   *
   * @default true
   */
  inferText?: boolean

  onFormated?: (item: SidebarItem, parent?: SidebarItem | null) => void
}

export function formatSidebar<T extends SidebarItem | SidebarItem[]>(
  sidebar: T,
  options: FormatOptions,
  parent?: SidebarItem | null,
) {
  if (isItemArray(sidebar)) {
    sidebar.forEach(item => formatSidebar(item, options, parent))
    return
  }

  const { root, nest, inferText, onFormated } = options

  formatBase(sidebar, parent, nest)
  formatText(sidebar, inferText)

  if (sidebar.items) {
    // 就近原则
    formatSidebar(sidebar.items, options, sidebar.base ? sidebar : parent)
  }

  formatPrepend(sidebar, root)
  onFormated?.(sidebar, parent)
}

function formatBase(sidebar: SidebarItem, parent?: SidebarItem | null, nest?: boolean) {
  if (!sidebar.base)
    return

  sidebar.base = !nest || isNestedBase(sidebar.base, parent?.base)
    ? normalizeBase(sidebar.base)
    : normalizeBase(parent?.base, sidebar.base)
}

function formatText(sidebar: SidebarItem, infer = false) {
  if (infer && !sidebar.text && sidebar.link) {
    sidebar.text = getLastSlug(sidebar.link)
  }
}

function formatPrepend(sidebar: SidebarItem, root?: string) {
  if (root && sidebar.base && !isNestedBase(sidebar.base, root)) {
    sidebar.base = normalizeBase(root, sidebar.base)
  }
}

export function formatSidebarMulti(sidebar: SidebarMulti, options: FormatOptions) {
  const { root } = options
  const keys = Object.keys(sidebar)

  keys.forEach((key) => {
    const items = sidebar[key]

    if (Object.hasOwn(sidebar, key)) {
      delete sidebar[key]
    }

    formatSidebar(items, options)

    const p = isNestedBase(key, root) ? normalizeBase(key) : normalizeBase(root, key)
    sidebar[p] = items
  })
}
