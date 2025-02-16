import type { SidebarItem } from '../../types'
import type { DirsItem } from '../types'

interface Fm extends Record<string, any> {
  title?: string
  order?: number
  date?: string
  group?: boolean | SidebarItem
}

export type Item = DirsItem<Fm>
