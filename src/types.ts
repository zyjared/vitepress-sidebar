import type { DefaultTheme } from 'vitepress'

export type Item = DefaultTheme.SidebarItem
export type Multi = DefaultTheme.SidebarMulti

export interface Group {
  base: string
  items: Item[]
}

export type Sidebar = Group | (Group | Item)[]
export type SidebarMulti = Multi
