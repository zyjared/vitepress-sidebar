import type { DefaultTheme, UserConfig } from 'vitepress'
import { defineConfig } from 'vitepress'
import { defineSidebar as defineSidebarDir } from './dir'
import { defineSidebar as defineSidebarRel } from './rel'

export const defineSidebar = defineSidebarRel
export const defineSidebarAuto = defineSidebarDir

export function defineConfigWithSidebar(config: UserConfig<DefaultTheme.Config>) {
  if (!config.themeConfig)
    config.themeConfig = {}

  config.themeConfig.sidebar = defineSidebarAuto({ srcDir: config.srcDir || '.' })
  return defineConfig(config)
}
