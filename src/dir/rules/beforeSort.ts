import type { Item } from './types'
import { assign, ensureIsSidebarItem } from '../../utils'
import { ITEM_FLAGS } from '../constant'

function assignFmSidebarToItem(item: Item) {
  const sidebar = item[ITEM_FLAGS.FRONT_MATTER]?.sidebar
  if (sidebar) {
    assign(item, ensureIsSidebarItem(sidebar))
  }
}

function setTitle(item: Item) {
  const text = item[ITEM_FLAGS.FRONT_MATTER]?.title
  if (text)
    item.text = text
}

export function beforeSort(item: Item) {
  setTitle(item)
  assignFmSidebarToItem(item)
}
