import type { SidebarMulti } from '../types'
import type { Options } from './opts'
import { getDirsMap } from './map'
import { initOptions } from './opts'
import { step } from './step'

export type { Options } from './opts'

export function defineSidebar(options: Options = {}) {
  const opts = initOptions(options)
  const dirsmap = getDirsMap(opts)

  step(dirsmap, opts)

  return dirsmap as SidebarMulti
}
