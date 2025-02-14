import type { Entry } from 'fast-glob'
import type { Dirs, DirsItem, DirsValue } from './types'
import fg from 'fast-glob'
import matter from 'gray-matter'
import { assign, normalizeBase, normalizeLink, parentBase, removeSuffix } from '../utils'
import { ITEM_FLAGS } from './constant'

function getFrontmatter(filepath: string) {
  return matter.read(filepath).data
}

export interface GetDirsMapOptions {
  includes: string[]

  srcDir?: string

  ignore?: string[]
  frontmatter?: boolean
}

/**
 * 得到所有 includes 的 map
 *
 * 注意
 *  - index.md 的信息会直接反映在所在文件夹，也就是 multi
 */
export function getDirsMap(options: GetDirsMapOptions) {
  const { includes, srcDir, ignore, frontmatter } = options

  const files = fg.globSync(includes, {
    dot: true,
    onlyFiles: true,
    stats: true,
    ignore,
  })

  const dirs = {} as Dirs
  const fixBase = createFixBase(srcDir)
  files.forEach(({ name, path: filepath, stats }) => {
    const parentPath = parentBase(filepath)
    const base = fixBase(parentPath)

    const extra = frontmatter && { [ITEM_FLAGS.FRONT_MATTER]: getFrontmatter(filepath) }
    const item = createItem(name, stats, extra)

    const parent = ensureDirsHasValue(dirs, base, extra)

    if (name === 'index.md') {
      item.link = './'
      Object.assign(parent, item)
    }
    else {
      parent.items.push(createItem(name, stats, extra))
    }
  })

  return dirs
}

function ensureDirsHasValue(dirs: Dirs, base: string, options?: DirsItem) {
  let multi = dirs[base]
  if (!multi) {
    multi = dirs[base] = { base, items: [] } as DirsValue
  }
  if (options) {
    assign(multi, options)
  }

  return multi
}

function createItem(name: string, stats?: Entry['stats'], options: DirsItem = {}) {
  const text = removeSuffix(name)
  return { text, link: text, [ITEM_FLAGS.CREATED_AT]: stats?.mtimeMs, ...options }
}

/**
 * 去除 base 的前缀 srcDir，并返回标准的 base
 */
function createFixBase(srcDir?: string) {
  if (!srcDir || srcDir === '/') {
    return (_p: string) => '/'
  }
  const nbase = normalizeLink(srcDir)
  return (p: string) => normalizeBase(p).replace(nbase, '')
}
