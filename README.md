# vitepress-sidebar

读取源目录，根据文件位置与 frontmatter 生成侧边栏数据。

## 使用

```bash
pnpm add -D @zyjared/vitepress-sidebar
```

```ts
// .vitepress 的 config.ts
import { defineSidebarAuto } from '@zyjared/vitepress-sidebar'
import { defineConfig } from 'vitepress'

export default defineConfig({
  // ...
  srcDir: 'docs',
  themeConfig: {
    sidebar: defineSidebarAuto({ srcDir: 'docs' })
  }
})
```

为了与 `config` 中的 `srcDir` 保持一致，可以使用 `defineConfigWithSidebar()`。

```ts
// .vitepress 的 config.ts
import { defineConfigWithSidebar } from '@zyjared/vitepress-sidebar'

export default defineConfigWithSidebar({
  // ...
  srcDir: 'docs'
})
```

> 内部的 sidebar 会被替换，暂不处理

## frontmatter

```md
---
order: 1          # 作为排序依据，优先级最高
date: 2025-01-01  # 作为排序依据
                  # 链接名也是排序依据，优先级最低

title: 标题
sidebar: false    # 不显示在侧边栏
---

# 一级标题

这些都会是链接名

1. frontmatter.title (优先级最高)
2. 一级标题
3. 文件名
```

## 多级侧边栏与index

默认情况下，一个文件夹内如果不存在 `index.md` 时，该文件夹是一个分组。并且，该分组会出现在侧边栏，而分组名就是文件夹名。

如果一个文件夹下存在 `index.md`，也可以通过 frontmatter 设置侧边栏规则。

```md
<!-- index.md -->
---
sidebar: group      # 表示所在文件夹应当视为分组
sidebar: collapsed  # 表示所在文件夹应当视为分组，并且默认收起

sidebar: true       # 不是分组，但是 `index` 应当视为链接出现在侧边栏

sidebar: false      # 所在文件夹下的文档都不应当出现在侧边栏
---

不设置 sidebar 时，表示不是分组，`index` 链接也不会出现在侧边栏。
```
