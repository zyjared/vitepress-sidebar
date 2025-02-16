import fg from 'fast-glob'
import { removeExtraSlash } from '../../utils'
import { buildAutoOptions } from '../opts'
import { beforeSort } from './beforeSort'
import { end } from './end'
import { createGroupRule } from './groupRule'
import { createSortRule } from './sortRule'

function createIncludes(includes: string[], srcDir?: string) {
  return srcDir
    ? includes.map(i => fg.convertPathToPattern(removeExtraSlash(`${srcDir}/${i}`)))
    : includes
}

export const initOptions = buildAutoOptions(
  (options) => {
    const {
      srcDir = '.',
      frontmatter = true,
      ignore = [],
      includes = ['**/*.md'],
      groupRule,
      sortRule,
      transform,
    } = options

    return {
      srcDir,
      frontmatter,
      transform,
      ignore: ['node_modules/**', '.git/**', 'dist/**', ...ignore],
      includes: createIncludes(includes, srcDir),
      groupRule: createGroupRule(groupRule),
      sortRule: createSortRule(sortRule),

      // internal
      beforeSort,
      end,
    }
  },
)
