import type { Options } from '.'
import type { StepOptions } from './step'
import type { DirsItem } from './types'
import fg from 'fast-glob'
import { SEP } from '../utils'
import { GROUP_RULE, ITEM_EXTRA_KEYS, ITEM_FLAGS, SORT_RULE } from './constant'

/** 清理 item 属性 */
const clearItem = function (item: DirsItem) {
  ITEM_EXTRA_KEYS.forEach(k => delete item[k])
  return item
}

const beforeTransform = function (item: DirsItem) {
  const text = item[ITEM_FLAGS.FRONT_MATTER]?.title
  return text ? { text } : {}
}

const afterTransform = function (item: DirsItem) {
  return clearItem(item)
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

export function initOptions(options: Options) {
  const {
    docs,
    ignore,
    transform,
    frontmatter = true,
    includes = ['**/*.md'],
    sortRule = SORT_RULE,
    groupRule = GROUP_RULE,
  } = options

  let patterns = includes
  if (docs) {
    const root = docs.endsWith(SEP) ? docs : docs + SEP
    patterns = docs ? includes.map(i => fg.convertPathToPattern(root + i)) : includes
  }

  return {
    docs,
    ignore,
    frontmatter,
    sortRule,
    groupRule,
    includes: patterns,
    transform: createTransform(transform),
    onTransformed: afterTransform,
  }
}
