import type { StepOptions } from '../step'
import type { DirsItem } from '../types'
import type { Item } from './types'
import { delObjKey, getLastSlug } from '../../utils'
import { ITEM_FLAGS } from '../constant'

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

export function createTransform(transform: StepOptions['transform']) {
  return (item: DirsItem) => {
    handleGroup(item)
    return transform ? transform(item) : {} as DirsItem
  }
}
