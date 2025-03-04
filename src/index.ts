import type { DefaultTheme, UserConfig } from 'vitepress'
import type { GeneratorOptions } from './generator'
import { defineConfig } from './config'
import { Generator } from './generator'

export function defineSidebarAuto(options: Partial<GeneratorOptions> = {}) {
  return new Generator(defineConfig(options)).generate()
}

export function defineConfigWithSidebar(config: UserConfig<DefaultTheme.Config>) {
  if (!config.themeConfig)
    config.themeConfig = {}

  config.themeConfig.sidebar = defineSidebarAuto({ srcDir: config.srcDir || '.' })
  return defineConfig(config)
}
