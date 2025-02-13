import type { SidebarMulti } from '../types'
import type { GetDirsMapOptions } from './map'
import type { StepOptions } from './step'
import { getDirsMap } from './map'
import { initOptions } from './opts'
import { step } from './step'

export type Options = GetDirsMapOptions & Partial<Omit<StepOptions, 'onTransformed'>>

export function defineSidebar(options: Options) {
  const opts = initOptions(options)
  const dirsmap = getDirsMap(opts)

  step(dirsmap, opts)

  return dirsmap as SidebarMulti
}
