import type { Entry } from 'fast-glob'
import type { Dirs, DirsItem } from './types'
import fg from 'fast-glob'
import { getLastSlug, normalizeBase, normalizeLink, parentBase, removeSuffix, SEP } from '../utils'
import { ITEM_FLAGS } from './constant'
import { getFrontmatter } from './fm'

export interface GetDirsMapOptions {
  docs: string

  includes?: string[]
  ignore?: string[]

  frontmatter?: boolean

  groupRule?: (dirname: string, dirpath: string) => (DirsItem | null)
}

function createGroupRule(groupRule?: GetDirsMapOptions['groupRule'], basepath?: string) {
  return groupRule ? (dirname: string) => groupRule(dirname, basepath) : null
}

export function getDirsMap(options: GetDirsMapOptions) {
  const { includes, docs, ignore, frontmatter, groupRule } = options

  const files = fg.globSync(includes, {
    dot: true,
    onlyFiles: true,
    stats: true,
    ignore,
  })

  const dirs = {} as Dirs
  const fixBase = createFixBase(docs)
  files.forEach(({ name, path: filepath, stats }) => {
    const parent = parentBase(filepath)
    const nparent = fixBase(parent)

    const group = ensureDirsHasGroup(dirs, nparent, createGroupRule(groupRule, parent))

    if (name === 'index.md') {
      groupWithLink(group)
    }
    else {
      const itemOpts = frontmatter && { [ITEM_FLAGS.FRONT_MATTER]: getFrontmatter(filepath) }
      group.items.push(createItem(name, stats, itemOpts))
    }
  })

  return groupRule ? groupWithParent(dirs) : dirs
}

function groupWithParent(dirs: Dirs) {
  const keys = Object.keys(dirs)

  const clearKeys = new Set<string>()
  for (const key of keys) {
    if (!dirs[key][ITEM_FLAGS.PARENT])
      continue

    const item = dirs[key]
    const parent = ensureDirsHasGroup(dirs, dirs[key][ITEM_FLAGS.PARENT])
    parent.items.push(item)

    clearKeys.add(key)
  }

  clearKeys.forEach(k => Object.hasOwn(dirs, k) && delete dirs[k])

  return dirs
}

type GrouRule = (dirname: string) => (DirsItem | null)

function ensureDirsHasGroup(dirs: Dirs, base: string, groupRule: GrouRule = null) {
  let group = dirs[base]
  if (!group) {
    group = dirs[base] = createGroup(base, groupRule)
  }

  return group
}

function createGroup(base: string, groupRule: GrouRule = null) {
  const item: DirsItem = { base, items: [] }
  if (groupRule) {
    const info = groupRule(getLastSlug(base))
    if (info) {
      item[ITEM_FLAGS.PARENT] = parentBase(base)
      Object.assign(item, info)
    }
  }
  return item
}

function createItem(name: string, stats?: Entry['stats'], options: DirsItem = {}) {
  const text = removeSuffix(name)
  return { text, link: text, [ITEM_FLAGS.CREATED_AT]: stats?.mtimeMs, ...options }
}

/**
 * 当该组存在 index.md 的时候，添加 link
 */
function groupWithLink(group: Dirs[string]) {
  group.link = './'
}

/**
 * @returns 函数：去除 base 的前缀 docs，并返回标准的 base
 */
function createFixBase(docs?: string) {
  if (!docs || docs === SEP) {
    return (_p: string) => SEP
  }
  const nbase = normalizeLink(docs)
  return (p: string) => normalizeBase(p).replace(nbase, '')
}
