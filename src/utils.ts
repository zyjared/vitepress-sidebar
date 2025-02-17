import type { SidebarItem, SidebarItemKey } from './types'
import { SIDEBAR_ITEM_KEYS } from './dir/constant'

export const SEP = '/'

export function removeExtraSlash(p: string) {
  return p.replace(/\/+$/, SEP)
}

function flink(p?: string): string {
  if (!p)
    return ''
  const link = p.startsWith(SEP) ? p : `${SEP}${p}`
  return link.endsWith(SEP) ? link.slice(0, -1) : link
}

export function normalizeLink(...paths: string[]) {
  return paths.map(flink).filter(Boolean).join('')
}

export function normalizeBase(...paths: string[]) {
  return `${normalizeLink(...paths)}${SEP}`
}

export function getLastSlug(url: string) {
  return url ? url.match(/\/([^/]+)\/?$/)?.[1] || url : ''
}

export function parentBase(p: string) {
  return p.match(/(.*\/)[^/]+\/?$/)?.[1] || '/'
}

export function removeSuffix(p: string) {
  return p.replace(/\.md$/, '')
}

export function assign(target: Record<string, any>, source: any) {
  if (!source || source === null || typeof source !== 'object') {
    return target
  }

  Object.keys(source).forEach(key => target[key] = source[key])

  return target
}

export function ensureIsSidebarItem(item: any, exclude: SidebarItemKey[] = []) {
  if (item === null || typeof item !== 'object') {
    return {}
  }

  const excluedSet = new Set(exclude)

  const sidebar = {} as SidebarItem
  Object.keys(item).forEach((key) => {
    if (SIDEBAR_ITEM_KEYS.has(key as SidebarItemKey) && !excluedSet.has(key as SidebarItemKey)) {
      sidebar[key] = item[key]
    }
  })
  return sidebar
}

export function delObjKey(obj: Record<string, any>, key: string) {
  if (Object.hasOwn(obj, key)) {
    delete obj[key]
    return true
  }
  return false
}
