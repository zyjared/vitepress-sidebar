import type { Options } from '../types'
import type { Item } from './types'
import { ITEM_FLAGS } from '../constant'
import { FM_KEYS } from './constant'

export function createGroupRule(multiRule?: Options['groupRule']) {
  if (multiRule) {
    return multiRule
  }
  return (item: Item) => {
    const frontmatter = item[ITEM_FLAGS.FRONT_MATTER]

    // 没有 index 时，不视为分组
    if (!item.link) {
      return false
    }

    return frontmatter?.[FM_KEYS.GROUP] !== false
  }
}
