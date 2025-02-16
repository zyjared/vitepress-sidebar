import type { SidebarGroup, SidebarItem, SidebarMulti } from '../types'
import type { FormatOptions } from './format'
import { normalizeBase } from '../utils'
import { formatSidebarMulti } from './format'
import { isGroup } from './types'

export function createSidebarMulti<T extends SidebarItem[] | SidebarGroup[]>(sidebar: T, options: FormatOptions): SidebarMulti {
  const multi: Record<string, SidebarGroup> = {}

  sidebar.forEach((item: SidebarItem | SidebarGroup) => {
    const group = isGroup(item) ? item : { base: '/', items: [item] }

    const p = normalizeBase(options.root, group.base)
    if (multi[p]) {
      multi[p].items.push(...group.items)
    }
    else {
      multi[p] = group
    }
  })

  formatSidebarMulti(multi, options)

  return multi
}
