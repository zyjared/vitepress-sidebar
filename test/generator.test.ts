import { describe, it } from 'vitest'
import { defineSidebarAuto } from '../src'

describe('defineSidebar', () => {
  it('no options', () => {
    const data = defineSidebarAuto({srcDir: 'temp'})
    console.log(JSON.stringify(data, null, 2))
  })
})
