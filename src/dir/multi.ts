import type { Dirs, DirsItem, DirsMulti, DirsValue } from './types'
import { assign, parentBase, SEP } from '../utils'

export interface ProcessMultiOptions {
  multiRule?: (item: DirsItem, dirpath: string) => DirsItem | boolean
  srcDir?: string
}

const createMultiRule = function (opts: ProcessMultiOptions) {
  const { multiRule, srcDir } = opts
  if (srcDir) {
    const src = srcDir.endsWith(SEP) ? srcDir.slice(0, -1) : srcDir
    return (item: DirsItem) => multiRule!(item, src + item.base)
  }
  return (item: DirsItem) => multiRule!(item, item.base)
}

export function toMulti(dirs: Dirs, options: ProcessMultiOptions = {}) {
  if (!options.multiRule)
    return dirs

  const multiRule = createMultiRule(options)
  const multis = Object.values(dirs)

  const clearKeys = new Set<string>()
  for (const multi of multis) {
    const { base } = multi

    // 跳过源目录
    if (base === '/')
      continue

    const res = multiRule(multi)
    if (!res) {
      continue
    }

    assign(multi, res)
    extendDirs(dirs, parentBase(base), multi)

    clearKeys.add(base)
  }

  clearKeys.forEach((k) => {
    Object.hasOwn(dirs, k) && delete dirs[k]
  })

  return dirs as DirsMulti
}

function extendDirs(dirs: DirsMulti, base: string, item: DirsValue) {
  let v = dirs[base]
  if (!v) {
    v = dirs[base] = []
  }

  if (Array.isArray(v)) {
    v.push(item)
  }
  else {
    v.items.push(item)
  }
}
