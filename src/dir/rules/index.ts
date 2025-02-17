import fg from 'fast-glob'
import { removeExtraSlash } from '../../utils'
import { buildAutoOptions } from '../opts'
import { end } from './end'
import { createFilterRoule } from './filterRule'
import { createGroupRule } from './groupRule'
import { prepare } from './prepare'
import { createSortRule } from './sortRule'
import { createTransform } from './transform'

function createIncludes(includes: string[], srcDir?: string) {
  return srcDir
    ? includes.map(i => fg.convertPathToPattern(removeExtraSlash(`${srcDir}/${i}`)))
    : includes
}

function createIgnore(ignore: string[]) {
  return ['node_modules/**', '.git/**', 'dist/**', ...ignore]
}

export const initOptions = buildAutoOptions(
  (options) => {
    const {
      srcDir = '.',
      frontmatter = true,
      ignore = [],
      includes = ['**/*.md'],
      groupRule,
      filterRule,
      sortRule,
      transform,
    } = options

    return {
      srcDir,

      frontmatter,

      ignore: createIgnore(ignore),
      includes: createIncludes(includes, srcDir),

      groupRule: createGroupRule(groupRule),

      filterRule: createFilterRoule(filterRule),
      sortRule: createSortRule(sortRule),
      transform: createTransform(transform),

      // internal
      prepare,
      end,
    }
  },
)
