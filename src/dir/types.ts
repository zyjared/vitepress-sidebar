import type { SidebarItem } from '../types'
import type { ITEM_FLAGS } from './constant'
import type { ToMultiOptions } from './multi'
import type { StepOptions } from './step'

export interface DirsItem<FM = Record<string, any>> extends SidebarItem {
  [ITEM_FLAGS.CREATED_AT]?: number

  [ITEM_FLAGS.FRONT_MATTER]?: FM

  /** 如果 [ITEM_FLAGS.FRONT_MATTER] 存在 */
  [ITEM_FLAGS.CONTENT_IS_EMPTY]?: boolean

  [ITEM_FLAGS.IS_GROUP]?: boolean

  items?: DirsItem[]
}

export interface DirsValue extends DirsItem {
  base: string
  items: DirsItem[]
}

export type Dirs = Record<string, DirsValue>
// export type DirsMulti = Record<string, DirsValue | DirsValue[]>

export interface Options {
  /**
   * 源目录
   *
   * 如果不提供该值，需要提供 `includes`
   */
  srcDir?: string

  includes?: string[]
  ignore?: string[]

  /**
   * 是否包含 frontmatter，
   * 开启时，frontmatter 存储在 `DirsItem.frontmatter`
   */
  frontmatter?: boolean

  /**
   * 返回值会覆盖原有的数据
   */
  transform?: StepOptions['transform']

  /**
   * 如果返回对象，视为多级侧边栏
   */
  groupRule?: ToMultiOptions['groupRule']

  filterRule?: StepOptions['filterRule']
  sortRule?: StepOptions['sortRule']
}
