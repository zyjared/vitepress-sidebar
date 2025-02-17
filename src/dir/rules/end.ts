import type { Dirs } from '../types'
import { delObjKey } from '../../utils'
import { isDisabledItem, isEmptyItem } from '../step'

export function end(dirs: Dirs) {
  const keys = Object.keys(dirs)

  keys.forEach((key) => {
    const it = dirs[key]
    const rm = isDisabledItem(it) || isEmptyItem(it)

    if (rm) {
      delObjKey(dirs, key)
    }
  })
}
