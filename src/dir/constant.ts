import type { GetDirsMapOptions } from './map'
import type { StepOptions } from './step'
import type { DirsItem } from './types'
import path from 'node:path'
import fs from 'fs-extra'

export enum ITEM_FLAGS {
  CREATED_AT = '__created_at',
  PARENT = '__parent',
  FRONT_MATTER = 'frontmatter',
  ORDER = '__order',
}

export const ITEM_EXTRA_KEYS = Object.values(ITEM_FLAGS)

/** 默认分组规则 */
export const GROUP_RULE: GetDirsMapOptions['groupRule'] = function (dirname: string, dirpath: string) {
  const file = path.join(dirpath, '.is-group')
  const exists = fs.existsSync(file)

  if (!exists)
    return null
  const content = fs.readFileSync(file, 'utf-8')

  return {
    text: dirname,
    [ITEM_FLAGS.ORDER]: Number.parseInt(content),
  }
}

/** 默认排序规则 */
export const SORT_RULE: StepOptions['sortRule'] = function (a: DirsItem, b: DirsItem) {
  const a_at = a[ITEM_FLAGS.FRONT_MATTER]?.date ?? a[ITEM_FLAGS.CREATED_AT]
  const b_at = b[ITEM_FLAGS.FRONT_MATTER]?.date ?? b[ITEM_FLAGS.CREATED_AT]

  if (a_at && b_at) {
    return b_at - a_at
  }

  const a_order = a[ITEM_FLAGS.ORDER]
  const b_order = b[ITEM_FLAGS.ORDER]
  if (a_order && b_order) {
    return a_order - b_order
  }

  return 0
}
