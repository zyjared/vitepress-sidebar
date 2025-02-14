# vitepress-sidebar

## 使用

```bash
pnpm add -D @zyjared/vitepress-sidebar
```

```ts
import { defineSidebarAuto } from '@zyjared/vitepress-sidebar'

const sidebar = defineSidebarAuto({
  srcDir: 'pages', // 默认 .
})
```

## 默认行为

> 可能会不定时改变

### 链接名

默认是使用文件名作为链接名，可以在 frontmatter 中设置 title 覆盖。

```md
---
title: Learn
---

# Learn
```

> 链接名的规则是可以自定义的，请查看配置项的 `transform`

### 多级侧边栏

在文件夹下创建一个 `.is-group` 文件表示该文件夹只是分组。并且，该文件中可以存储一个数字，排序时会根据该数字进行排序。

```
|- pages # 源目录
  |- learn
    |- group-1
        |- .is-group
        |- file1.md
        |- file2.md
        |- index.md
    |- group-2
        |- .is-group
        |- file3.md
        |- file4.md
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
        link: './', // 如果该文件夹下存在 index.md
        items: [
          { text: 'file1', link: 'file1' },
          { text: 'file2', link: 'file2' },
        ]
      },
      {
        base: '/learn/group-2/',
        items: [
          { text: 'file3', link: 'file3' },
          { text: 'file4', link: 'file4' },
        ]
      }
    ]
  }
}
```

> 判定一个文件夹是否为分组是可以自定义规则的，请查看配置项的 `groupRule`

### 排序

根据文件创建时间排序。

> 排序规则是可以自定义的，请查看配置项的 `sortRule`

## 自定义

- `groupRule`: 判定是否为多级侧边栏，返回值即 `SidebarItem` 信息
- `sortRule`: 排序规则
- `transform`: 返回值即覆盖 `SidebarItem`

其他配置项请查看具体类型。
