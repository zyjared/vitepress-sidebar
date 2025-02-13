import type { SidebarItem } from '../types'
import type { ITEM_FLAGS } from './constant'

export interface DirsItem extends SidebarItem {
  [ITEM_FLAGS.CREATED_AT]?: number
  [ITEM_FLAGS.PARENT]?: string
  [ITEM_FLAGS.FRONT_MATTER]?: Record<string, any>
  [ITEM_FLAGS.ORDER]?: number
  items?: DirsItem[]
}

export type Dirs = Record<string, DirsItem>
