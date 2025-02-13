import type { Item } from '../types'
import type { Dirs, DirsItem } from './types'

export interface StepOptions {
  sortRule?: (a: DirsItem, b: DirsItem) => number
  transform?: (item: DirsItem) => Item
}

export function step(dirs: Dirs, options: StepOptions) {
  const { sortRule, transform } = options

  const traverse = function (item: DirsItem) {
    if (item.items) {
      item.items.sort(sortRule)
      item.items.forEach(traverse)
    }
    Object.assign(item, transform(item))
  }

  Object.values(dirs).forEach(traverse)
  return dirs
}
