import type { DirsItem, DirsMulti } from './types'
import { assign } from '../utils'
import { ITEM_EXTRA_KEYS } from './constant'

export interface StepOptions {
  beforeSort?: (item: DirsItem) => void
  sortRule?: (a: DirsItem, b: DirsItem) => number
  end?: (dirsMulti: DirsMulti) => void

  transform?: (item: DirsItem) => DirsItem
}

const clearItemFlags = function (item: DirsItem) {
  ITEM_EXTRA_KEYS.forEach(k => delete item[k])
}

export function step(dirsMulti: DirsMulti, options: StepOptions) {
  const { beforeSort, sortRule, transform, end } = options
  const traverse = function (it: DirsItem | DirsItem[]) {
    if (Array.isArray(it)) {
      it.forEach(traverse)
      return it.sort(sortRule)
    }

    beforeSort && beforeSort(it)

    if (it.items) {
      traverse(it.items)
    }

    transform && assign(it, transform(it))
    return it
  }

  Object.values(dirsMulti).forEach(traverse)

  end && end(dirsMulti)
  clearDirsMulti(dirsMulti)

  return dirsMulti
}

function clearDirsMulti(dirsMulti: DirsMulti) {
  const traverse = (item: DirsItem) => {
    if (item.items) {
      item.items.forEach(traverse)
    }
    clearItemFlags(item)
  }
  Object.values(dirsMulti).forEach(i => Array.isArray(i) ? i.forEach(traverse) : traverse(i))
}
