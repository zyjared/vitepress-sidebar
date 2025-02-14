import type { GetDirsMapOptions } from './map'
import type { ProcessMultiOptions } from './multi'
import type { StepOptions } from './step'
import type { DirsItem, Options } from './types'
import fg from 'fast-glob'
import { removeExtraSlash } from '../utils'
import { ITEM_FLAGS } from './constant'

type ExtendOptionsInit = (options: Options) => GetDirsMapOptions & ProcessMultiOptions & StepOptions

/**
 * 构建自己的配置
 */
export function buildAutoOptions(extendOptionsInit: ExtendOptionsInit) {
  return (options?: Options | null) => extendOptionsInit(options || {})
}

//
// 默认配置
// ------------------------

const createIncludes = function (includes: string[], srcDir?: string) {
  return srcDir
    ? includes.map(i => fg.convertPathToPattern(removeExtraSlash(`${srcDir}/${i}`)))
    : includes
}

const createMultiRule = function (multiRule?: ProcessMultiOptions['multiRule']) {
  return multiRule || ((item: DirsItem) => !!item.link)
}

const createSortRule = function (sortRule: StepOptions['sortRule']) {
  if (sortRule) {
    return sortRule
  }

  return function (a: DirsItem, b: DirsItem) {
    const afm = a[ITEM_FLAGS.FRONT_MATTER]
    const bfm = b[ITEM_FLAGS.FRONT_MATTER]

    if (afm && bfm) {
      const ls = ['order', 'date']
      for (let i = 0; i < ls.length; i++) {
        const ai = afm[ls[i]]
        const bi = bfm[ls[i]]
        if (ai && bi) {
          return ai - bi
        }
      }
    }

    return a[ITEM_FLAGS.CREATED_AT] - b[ITEM_FLAGS.CREATED_AT]
  }
}

const beforeTransform = function (item: DirsItem) {
  const text = item[ITEM_FLAGS.FRONT_MATTER]?.title
  if (text) {
    item.text = text
  }
  return item
}

const createTransform = function (transform?: StepOptions['transform']) {
  if (transform) {
    return (item: DirsItem) => transform(beforeTransform(item))
  }

  return (item: DirsItem) => {
    beforeTransform(item)
    return {}
  }
}

export const initOptions = buildAutoOptions(
  (options: Options | null) => {
    const {
      srcDir = '.',
      transform,
      frontmatter = true,
      ignore = [],
      includes = ['**/*.md'],
      multiRule,
      sortRule,
    } = options

    return {
      srcDir,
      frontmatter,
      ignore: ['node_modules/**', '.git/**', 'dist/**', ...ignore],
      includes: createIncludes(includes, srcDir),
      multiRule: createMultiRule(multiRule),
      sortRule: createSortRule(sortRule),
      transform: createTransform(transform),
    }
  },
)
