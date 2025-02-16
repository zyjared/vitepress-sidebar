import type { DefaultTheme } from 'vitepress'

export type SidebarItem = DefaultTheme.SidebarItem
export type SidebarMulti = DefaultTheme.SidebarMulti

export interface SidebarGroup {
  base: string
  items: SidebarItem[]
}

export type Sidebar = SidebarGroup | (SidebarGroup | SidebarItem)[]
export type SidebarItemKey = keyof SidebarItem
