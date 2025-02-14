# vitepress-sidebar

读取一个文件夹，自动生成侧边栏。

## 使用

```bash
pnpm add -D @zyjared/vitepress-sidebar
```

```ts
import { defineSidebarAuto } from '@zyjared/vitepress-sidebar'
import { defineConfig } from 'vitepress'

const sidebar = defineSidebarAuto({
  // 默认为 '.'
  srcDir: 'pages',
})

// vitepress.config.ts
export default defineConfig({
  // ...
  themeConfig: {
    sidebar
  }
})
```

## 默认行为

### 链接名

默认是使用文件名作为 `item.text`，可以在 `frontmatter` 中设置 `title` 覆盖。

```md
---
title: Learn
---

# Learn
```

> 链接名的规则是可以自定义的，可以配置 `transform` 项覆盖，如
>
> `transform: (item) => ({ text: item.frontmatter.title })`

### 排序

排序优先级：

1. frontmatter 中`order`
2. frontmatter 中 `date`
3. 文件创建时间

> 排序规则是可以自定义的，可以通过配置项 `transform` 来覆盖，如
>
> `sortRule: (a, b) => a.frontmatter.order - b.frontmatter.order`

### 多级侧边栏

index.md 的信息都会赋予目录，会视为侧边栏的分组，排序等也会由 index.md 决定。

```
|- pages # 源目录
  |- learn
    |- group-1
      |- file1.md
      |- file2.md
      |- index.md # index.md 的信息都会赋予目录
    |- group-2
      |- file3.md
      |- file4.md
      |- index.md
```

```ts
const sidebar = defineSidebarAuto({
  docs: 'pages',
})

// 相当于

const sidebar = {
  '/learn/': {
    base: '/learn/',
    items: [
      {
        base: '/learn/group-1/',
        text: 'group-1',
        link: './',
        items: [
          { text: 'file1', link: 'file1' },
          { text: 'file2', link: 'file2' },
        ]
      },
      {
        base: '/learn/group-2/',
        text: 'group-2',
        link: './',
        items: [
          { text: 'file3', link: 'file3' },
          { text: 'file4', link: 'file4' },
        ]
      }
    ]
  }
}
```

> 可以通过配置 `multiRule` 覆盖，如
>
> `multiRule: (item, dirpath) => true`

## 自定义

默认行为是 `defineSidebarAuto()` 的第二个参数决定的，默认提供了一个初始化配置项的函数。

你可以：

- 扩展默认行为
- 重写默认行为

```ts
import { buildAutoOptions, defineSidebarAuto as defineSidebar } from '@zyjared/vitepress-sidebar'

// 这具有默认行为
const sidebar = defineSidebar({ srcDir: 'pages' })

// 可以通过第二个参数，清除默认行为，
// 并构建一套自定义的规则
const sidebar = defineSidebar({}, buildAutoOptions(options => options))
```
