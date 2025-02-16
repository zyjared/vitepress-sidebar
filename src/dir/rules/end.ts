import type { DirsMulti } from '../types'
import type { Item } from './types'
import { ITEM_FLAGS } from '../constant'

function isEmptyItem(item: Item) {
  return item.items ? !item.items.length && item[ITEM_FLAGS.CONTENT_IS_EMPTY] : item[ITEM_FLAGS.CONTENT_IS_EMPTY]
}

function isDisabledItem(item: Item) {
  return item[ITEM_FLAGS.FRONT_MATTER]?.sidebar === false
}

function handleGroupLink(it: Item) {
  if (it[ITEM_FLAGS.IS_GROUP] && it[ITEM_FLAGS.CONTENT_IS_EMPTY]) {
    delete it.link
  }
}

function traverse<T extends Item[] | Item>(it: T): T {
  if (Array.isArray(it)) {
    it.forEach(traverse)
    return it.filter(i => !isEmptyItem(i) && !isDisabledItem(i)) as T
  }

  if (it.items) {
    handleGroupLink(it)
    it.items = traverse(it.items)
  }
  return it
}

export function end(dirsMulti: DirsMulti) {
  const keys = Object.keys(dirsMulti)

  keys.forEach((key) => {
    const it = traverse(dirsMulti[key])
    const rm = Array.isArray(it) ? !it.length : isEmptyItem(it) || isDisabledItem(it)

    if (rm) {
      delete dirsMulti[key]
    }
  })
}
