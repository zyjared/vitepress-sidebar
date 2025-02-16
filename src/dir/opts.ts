import type { GetDirsMapOptions } from './map'
import type { ToMultiOptions } from './multi'
import type { StepOptions } from './step'
import type { Options } from './types'

type ExtendOptionsInit = (options: Options) => GetDirsMapOptions & ToMultiOptions & StepOptions

/**
 * 构建自己的配置
 */
export function buildAutoOptions(extendOptionsInit: ExtendOptionsInit) {
  return (options?: Options | null) => extendOptionsInit(options || {})
}
