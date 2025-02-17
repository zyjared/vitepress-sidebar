import type { DirsMulti } from '../types'
import type { Item } from './types'
import { delObjKey, getLastSlug } from '../../utils'
import { ITEM_FLAGS } from '../constant'

function isEmptyItem(item: Item) {
  return item.items ? !item.items.length && item[ITEM_FLAGS.CONTENT_IS_EMPTY] : item[ITEM_FLAGS.CONTENT_IS_EMPTY]
}

function isDisabledItem(item: Item) {
  return item[ITEM_FLAGS.FRONT_MATTER]?.sidebar === false
}

function handleGroup(it: Item) {
  if (!it[ITEM_FLAGS.IS_GROUP])
    return

  const contentIsEmpty = it[ITEM_FLAGS.CONTENT_IS_EMPTY]
  // 内容为空时，删除链接
  if (contentIsEmpty) {
    delObjKey(it, 'link')
  }

  // 如果内容不为空，且没有子项，转为链接
  if (!contentIsEmpty && !it.items?.length) {
    it.link = getLastSlug(it.base)
    delObjKey(it, 'base')
    delObjKey(it, 'items')
    delObjKey(it, ITEM_FLAGS.IS_GROUP)
  }
}

function traverse<T extends Item[] | Item>(it: T): T {
  if (Array.isArray(it)) {
    it.forEach(traverse)
    return it.filter(i => !isEmptyItem(i) && !isDisabledItem(i)) as T
  }

  if (it.items) {
    it.items = traverse(it.items)
    handleGroup(it)
  }
  return it
}

export function end(dirsMulti: DirsMulti) {
  const keys = Object.keys(dirsMulti)

  keys.forEach((key) => {
    const it = traverse(dirsMulti[key])
    const rm = Array.isArray(it) ? !it.length : isEmptyItem(it) || isDisabledItem(it)

    if (rm) {
      delObjKey(dirsMulti, key)
    }
  })
}
