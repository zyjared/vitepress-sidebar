// import type { DefaultTheme } from 'vitepress'

export interface Multi {
  [path: string]: Item[] | { items: Item[], base: string }
}

/**
 * @see https://github.com/vuejs/vitepress/blob/main/types/default-theme.d.ts
 */
export interface Item {
  text?: string
  link?: string
  items?: Item[]
  collapsed?: boolean
  base?: string
  docFooterText?: string
  rel?: string
  target?: string
}

export interface Group {
  base: string
  items: Item[]
}

export type Sidebar = Group | (Group | Item)[]
export type SidebarMulti = Multi
