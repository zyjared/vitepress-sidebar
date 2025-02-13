import type { SidebarItem } from '../src/types'
import path from 'node:path'
import fs from 'fs-extra'
import { afterAll, beforeAll, expect, it } from 'vitest'
import { defineSidebarAuto } from '../src'

const srcDir = 'test-pages'
const sidebar = {
  '/folder-1/group-1/': {
    base: '/folder-1/group-1/',
    items: [
      {
        text: 'file-1',
        link: 'file-1',
      },
      {
        text: 'file-2',
        link: 'file-2',
      },
    ],
    link: './',
  },
  '/folder-1/group-2/': {
    base: '/folder-1/group-2/',
    items: [
      {
        text: 'file-3',
        link: 'file-3',
      },
      {
        text: 'file-4',
        link: 'file-4',
      },
    ],
    link: './',
  },
  '/folder-2/': {
    base: '/folder-2/',
    items: [
      {
        text: 'file-5',
        link: 'file-5',
      },
    ],
  },
}

beforeAll(() => {
  interface Node {
    item: SidebarItem
    parent?: SidebarItem
  }
  const createNode = (item: SidebarItem, parent?: SidebarItem) => ({ item, parent })
  const createFile = (filename: string, base?: string, suffix = '.md') => fs.writeFileSync(path.join(srcDir, base, `${filename}${suffix}`), '')

  const queue = Object.values(sidebar).map(item => createNode(item)) as Node[]
  let node: Node | undefined = queue.shift()
  while (node) {
    const { item, parent } = node
    const { items, base, link } = item

    if (items && base) {
      queue.push(...items.map(el => createNode(el, item)))
      fs.ensureDirSync(path.join(srcDir, base))
      if (link) {
        createFile('index', base)
      }
    }
    else {
      createFile(link, parent?.base)
    }

    node = queue.shift()
  }
})

afterAll(() => {
  fs.removeSync(srcDir)
})

it('auto', () => {
  const autoSidebar = defineSidebarAuto({ docs: 'test-pages' })
  expect(autoSidebar).toMatchObject(sidebar)
})
