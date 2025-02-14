import type { GetDirsMapOptions } from './map'
import type { StepOptions } from './step'
import type { DirsItem } from './types'
import fg from 'fast-glob'
import { GROUP_RULE, ITEM_EXTRA_KEYS, ITEM_FLAGS, SORT_RULE } from './constant'

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
   * `SidebarItem` 是否包含 frontmatter
   *
   * @default true
   */
  frontmatter?: boolean

  /**
   * 返回 `SidebarItem` 类型，覆盖原有的 `SidebarItem`
   */
  transform?: StepOptions['transform']

  /**
   * 默认根据创建时间排序
   */
  sortRule?: StepOptions['sortRule']

  /**
   * 如果返回对象，视为 `SidebarItem` 的分组，
   * 该对象中的键值加入到 `SidebarItem`，
   * 这些键值可以在 `tansform` 和 `groupRule` 中使用。
   *
   * 默认文件夹中含有 `.is-group` 文件，视为分组
   */
  groupRule?: GetDirsMapOptions['groupRule']

}

/** 清理 item 属性 */
const clearItem = function (item: DirsItem) {
  ITEM_EXTRA_KEYS.forEach(k => delete item[k])
  return item
}

const onTransformed = function (item: DirsItem) {
  return clearItem(item)
}

const beforeTransform = function (item: DirsItem) {
  const text = item[ITEM_FLAGS.FRONT_MATTER]?.title
  return text ? { text } : {}
}

const createTransform = function (transform?: StepOptions['transform']) {
  if (transform) {
    return function (item: DirsItem) {
      return transform(
        beforeTransform(item),
      )
    }
  }
  return function (item: DirsItem) {
    return beforeTransform(item)
  }
}

const createIncludes = function (includes: string[], srcDir?: string) {
  if (srcDir) {
    return includes.map(i => fg.convertPathToPattern((`${srcDir}/${i}`).replace(/\/+/g, '/')))
  }
  return includes
}

export function initOptions(options: Options) {
  const {
    srcDir = '.',
    transform,
    frontmatter = true,
    ignore = [],
    includes = ['**/*.md'],
    sortRule = SORT_RULE,
    groupRule = GROUP_RULE,
  } = options

  return {
    srcDir,
    frontmatter,
    sortRule,
    groupRule,
    includes: createIncludes(includes, srcDir),
    ignore: ['node_modules/**', '.git/**', 'dist/**', ...ignore],
    transform: createTransform(transform),

    /**
     * @internal
     */
    onTransformed,
  }
}
