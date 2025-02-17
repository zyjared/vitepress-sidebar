import type { Item } from './types'
import { assign, ensureIsSidebarItem } from '../../utils'
import { ITEM_FLAGS } from '../constant'

function setText(item: Item) {
  const text = item[ITEM_FLAGS.FRONT_MATTER]?.title
  if (text)
    item.text = text
}

function assignFmSidebarToItem(item: Item) {
  const sidebar = item[ITEM_FLAGS.FRONT_MATTER]?.sidebar
  if (sidebar) {
    assign(item, ensureIsSidebarItem(sidebar))
  }
}

export function prepare(item: Item) {
  setText(item)
  assignFmSidebarToItem(item)
}
