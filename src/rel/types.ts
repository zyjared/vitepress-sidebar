import type { Group, Item, Sidebar, SidebarMulti } from '../types'

import { normalizeLink } from '../utils'

type SidebarArg = Sidebar | Item | SidebarMulti

export function isItemArray(sidebar: SidebarArg): sidebar is Item[] {
  return Array.isArray(sidebar)
}

export function isGroup(sidebar: SidebarArg): sidebar is Group {
  return Object.hasOwn(sidebar, 'base') && isItemArray((sidebar as Item).items)
}

export function isSidebarMulti(sidebar: SidebarArg): sidebar is SidebarMulti {
  return !isItemArray(sidebar) && !isGroup(sidebar)
}

export function isNestedBase(base: string, root?: string): boolean {
  const nroot = normalizeLink(root)
  return nroot.length > 1 && base.startsWith(nroot)
}
