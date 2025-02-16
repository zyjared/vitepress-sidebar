import type { SidebarMulti } from '../types'
import type { Options } from './types'
import { getDirsMap } from './map'
import { toMulti } from './multi'
import { initOptions } from './rules'
import { step } from './step'

export { buildAutoOptions } from './opts'

/**
 * 自动构建侧边栏
 *
 * 注意配置源目录 `srcDir` 项
 */
export function defineSidebar(options: Options | null = {}, extendInitOptions = initOptions): SidebarMulti {
  const opts = extendInitOptions(options)
  const dirsmap = getDirsMap(opts)

  const dirsMulti = toMulti(dirsmap, opts)
  step(dirsMulti, opts)

  return dirsMulti as SidebarMulti
}
