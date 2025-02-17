import type { SidebarMulti } from '../types'
import type { Item } from './rules/types'
import type { Dirs, DirsItem } from './types'
import { assign, delObjKey } from '../utils'
import { ITEM_EXTRA_KEYS, ITEM_FLAGS } from './constant'

export interface StepOptions {
  prepare?: (item: DirsItem) => void
  filterRule?: (item: DirsItem) => boolean
  sortRule?: (a: DirsItem, b: DirsItem) => number
  end?: (dirs: Dirs) => void

  transform?: (item: DirsItem) => DirsItem
}

export function isEmptyItem(item: Item) {
  return item.items ? !item.items.length && item[ITEM_FLAGS.CONTENT_IS_EMPTY] : item[ITEM_FLAGS.CONTENT_IS_EMPTY]
}

export function isDisabledItem(item: Item) {
  return item[ITEM_FLAGS.FRONT_MATTER]?.sidebar === false
}

function clearItemFlags(item: DirsItem) {
  ITEM_EXTRA_KEYS.forEach(k => delObjKey(item, k))
}

function clearDirsMultiFlags(dirs: Dirs) {
  const traverse = (item: DirsItem) => {
    if (item.items) {
      item.items.forEach(traverse)
    }
    clearItemFlags(item)
  }
  Object.values(dirs).forEach(i => Array.isArray(i) ? i.forEach(traverse) : traverse(i))
}

function clearSrcDir(dirs: Dirs) {
  const it = dirs['/']
  if (!it || Array.isArray(it))
    return

  if (!it.items?.length) {
    delObjKey(dirs, '/')
    return
  }

  delObjKey(it, 'link')
  delObjKey(it, 'text')
}

function toSidebarMulti(dirs: Dirs) {
  clearSrcDir(dirs)
  clearDirsMultiFlags(dirs)

  const sidebar = dirs as SidebarMulti
  Object.keys(dirs).forEach((k) => {
    const it = dirs[k]
    if (!it.link && it.items.every(i => i.base)) {
      sidebar[k] = it.items
    }
  })

  return sidebar
}

export function step(dirs: Dirs, options: StepOptions): SidebarMulti {
  const { prepare, filterRule, sortRule, transform, end } = options

  const traverse = function (it: DirsItem) {
    prepare && prepare(it)

    if (it.items) {
      it.items = it.items.filter(i => !filterRule(i))
      it.items.forEach(traverse)
      it.items.sort(sortRule)
    }

    transform && assign(it, transform(it))
    return it
  }

  Object.values(dirs).forEach(traverse)

  end && end(dirs)

  return toSidebarMulti(dirs)
}
