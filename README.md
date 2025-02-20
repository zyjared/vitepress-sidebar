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

可以直接在 frontmatter 中配置侧边栏数据，包括多级侧边栏。

```md
---
# sidebar: false # 不出现在侧边栏
sidebar:
  text: title
  # link: filename # 这也会覆盖 link

# 标题: 省略则是文档的一级标题或文件名
# 会被 sidebar 的 text 覆盖
title: 自定义标题

# 排序方式: order > date > 文件名/文件夹名
order: 1 # 优先级最高
date: 2025-01-01
---

# 标题
```

### 多级侧边栏

如果需要多级侧边栏，可以在文件夹下创建一个 `index.md` 文件，`index.md` 中的数据就是这个分组的数据。

```md
---
# group: false # 所在文件夹不作为分组

# sidebar: false # 所在文件夹不出现在侧边栏
sidebar:
  text: group-title

# 如果不使用文件夹名或一级标题作为分组名
title: group-title

order: 2
date: 2025-01-01
---
```

`index.md` 中不一定要有内容，如果没有内容或只有 frontmatter，那么其所在文件夹不会有 `link` 值。

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
