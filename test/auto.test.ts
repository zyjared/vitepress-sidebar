import fs from 'fs-extra'
import { afterAll, beforeAll, expect, it } from 'vitest'

import { defineSidebarAuto } from '../src'
import { generateTestFiles } from './utils'

const srcDir = 'test-pages'
const sidebar = {
  // 多级：子文件夹中存在 index.md
  '/folder-1/': [
    {
      base: '/folder-1/group-1/',
      text: 'group-1',
      content: '---\norder: 2\n---\ntest',
      link: './',
      items: [
        // text 为一级标题
        {
          link: 'file-1',
          text: 'test',
          content: '# test',
        },
        // text 无一级标题时
        {
          text: 'file-2',
          link: 'file-2',
          content: '## test',
        },
      ],
    },
    {
      base: '/folder-1/group-2/',
      text: 'group-2',
      link: './',
      content: 'test',
      items: [
        // text 使用 frontmatter.title
        {
          text: 'test-title',
          link: 'file-3',
          content: '---\ntitle: test-title\n---\n# test',
        },
        // content 为空时不展示
        {
          text: 'file-4',
          link: 'file-4',
          content: '',
        },
      ],
    },
  ],

  '/folder-2/': {
    base: '/folder-2/',
    items: [
      // 默认按文件名（link/base末尾slug）排序
      {
        text: '1-file-5',
        link: '1-file-5',
        content: 'test',
      },
      // frontmatter.sidebar 为 false 不展示
      {
        text: '2-file-5',
        link: '2-file-5',
        content: '---\nsidebar: false\n---\n# test',
        sidebar: false,
      },
      //  分组可以通过 index 的 frontmatter 配置
      {
        base: '/folder-2/2-group-3/',
        text: 'custom-group',
        link: './',
        collapsed: true,
        content: '---\nsidebar:\n  text: custom-group\n  collapsed: true\n---\n# test',
        items: [
          {
            text: 'file-6',
            link: 'file-6',
            content: 'test',
          },
        ],
      },
      // 分组有内容(index有内容)，但是没有子项时，转为普通链接
      {
        base: '/folder-2/3-group-4/',
        text: '3-group-4',
        link: '3-group-4',
        content: 'test',
        items: [],
      },
    ],
  },
}

beforeAll(() => {
  generateTestFiles(sidebar, srcDir)
})

afterAll(() => {
  fs.removeSync(srcDir)
})

it('auto', () => {
  const autoSidebar = defineSidebarAuto({
    srcDir: 'test-pages',
  })
  //   console.log(JSON.stringify(autoSidebar, null, 2))
  expect(autoSidebar).toMatchObject(sidebar)
})
