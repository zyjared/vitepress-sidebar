import type { Dirs, DirsItem } from './types'
import { assign, delObjKey, ensureIsSidebarItem, parentBase, SEP } from '../utils'
import { ITEM_FLAGS } from './constant'
import { ensureDirsHasValue } from './map'

export interface ToMultiOptions {
  groupRule?: (item: DirsItem, dirpath: string) => boolean | DirsItem
  srcDir?: string
}

const createGroupRule = function (opts: ToMultiOptions) {
  const { groupRule, srcDir } = opts
  if (srcDir) {
    const src = srcDir.endsWith(SEP) ? srcDir.slice(0, -1) : srcDir
    return (item: DirsItem) => groupRule!(item, src + item.base)
  }
  return (item: DirsItem) => groupRule!(item, item.base)
}

function signIsGroup(item: DirsItem) {
  item[ITEM_FLAGS.IS_GROUP] = true
}

export function toMulti(dirs: Dirs, options: ToMultiOptions = {}) {
  if (!options.groupRule)
    return dirs

  const groupRule = createGroupRule(options)
  const multis = Object.values(dirs)

  const clearKeys = new Set<string>()
  for (const multi of multis) {
    const { base } = multi

    // 跳过源目录
    if (base === '/')
      continue

    const res = groupRule(multi)
    if (!res) {
      continue
    }

    assign(multi, ensureIsSidebarItem(res))
    signIsGroup(multi)

    const parent = ensureDirsHasValue(dirs, parentBase(base))
    parent.items.push(multi)

    clearKeys.add(base)
  }

  clearKeys.forEach((k) => {
    Object.hasOwn(dirs, k) && delObjKey(dirs, k)
  })

  return dirs
}
