import type { StepOptions } from '../step'
import type { Item } from './types'
import { isDisabledItem, isEmptyItem } from '../step'

export function createFilterRoule(filterRule: StepOptions['filterRule']) {
  if (filterRule) {
    return filterRule
  }
  return (item: Item) => isDisabledItem(item) || isEmptyItem(item)
}
