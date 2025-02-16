import type { Entry } from 'fast-glob'
import type { Dirs, DirsItem, DirsValue } from './types'
import fg from 'fast-glob'
import matter from 'gray-matter'
import { assign, getLastSlug, normalizeBase, normalizeLink, parentBase, removeSuffix } from '../utils'
import { ITEM_FLAGS } from './constant'

function getDataWithFrontmatter(filepath: string): Pick<DirsItem, ITEM_FLAGS.FRONT_MATTER | ITEM_FLAGS.CONTENT_IS_EMPTY> {
  const { content, data } = matter.read(filepath)
  const noEmpty = /./.test(content.trim())

  if (noEmpty && !data.title) {
    const titleMatch = content.match(/^#\s+(.+)/m)
    if (titleMatch) {
      data.title = titleMatch[1].trim()
    }
  }

  return {
    [ITEM_FLAGS.FRONT_MATTER]: data,
    [ITEM_FLAGS.CONTENT_IS_EMPTY]: !noEmpty,
  }
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
 *  - fontmatter.title 如果不存在，会从 content 中获取
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
  const getExtra = frontmatter ? getDataWithFrontmatter : (_i: string) => ({})

  files.forEach(({ name, path: filepath, stats }) => {
    const pPath = parentBase(filepath)
    const base = fixBase(pPath)

    const item = createItem(name, stats, getExtra(filepath))

    const parent = ensureDirsHasValue(dirs, base)

    if (name === 'index.md') {
      dirsValueHasIndex(parent, item)
    }
    else {
      parent.items.push(item)
    }
  })

  return dirs
}

function dirsValueHasIndex(val: DirsValue, item: DirsItem) {
  item.link = './'
  item.text = getLastSlug(val.base)
  assign(val, item)
}

function ensureDirsHasValue(dirs: Dirs, base: string, extra?: DirsItem) {
  let multi = dirs[base]
  if (!multi) {
    multi = dirs[base] = { base, items: [] } as DirsValue
  }
  if (extra) {
    assign(multi, extra)
  }

  return multi
}

function createItem(name: string, stats?: Entry['stats'], extra?: DirsItem) {
  const text = removeSuffix(name)
  const item = {
    text,
    link: text,
    [ITEM_FLAGS.CREATED_AT]: stats?.birthtimeMs,
  }
  return assign(item, extra)
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
