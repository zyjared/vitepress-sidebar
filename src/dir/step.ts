import type { DirsItem, DirsMulti } from './types'
import { assign } from '../utils'
import { ITEM_EXTRA_KEYS } from './constant'

export interface StepOptions {

  sortRule?: (a: DirsItem, b: DirsItem) => number

  transform?: (item: DirsItem) => DirsItem
}

const clearItemFlags = function (item: DirsItem) {
  ITEM_EXTRA_KEYS.forEach(k => delete item[k])
}

export function step(dirsMulti: DirsMulti, options: StepOptions) {
  const { sortRule, transform } = options
  const traverse = function (item: DirsItem) {
    if (item.items) {
      sortRule && item.items.sort(sortRule)
      item.items.forEach(traverse)
    }
    transform && assign(item, transform(item))
    clearItemFlags(item)
  }

  Object.values(dirsMulti).forEach(i => Array.isArray(i) ? i.forEach(traverse) : traverse(i))

  return dirsMulti
}
