import type { Options } from '../types'
import type { Item } from './types'
import { getLastSlug } from '../../utils'
import { ITEM_FLAGS } from '../constant'

function getFilename(item: Item) {
  return item[ITEM_FLAGS.IS_GROUP] ? getLastSlug(item.base) : item.link
}

export function createSortRule(sortRule: Options['sortRule']) {
  if (sortRule) {
    return sortRule
  }

  return function (a: Item, b: Item) {
    const afm = a[ITEM_FLAGS.FRONT_MATTER]
    const bfm = b[ITEM_FLAGS.FRONT_MATTER]

    if (afm && bfm) {
      const ls = ['order', 'date']
      for (let i = 0; i < ls.length; i++) {
        const ai = afm[ls[i]]
        const bi = bfm[ls[i]]
        if (ai && bi) {
          return ai < bi ? -1 : 1
        }
      }
    }

    return getFilename(a) < getFilename(b) ? -1 : 1
  }
}
