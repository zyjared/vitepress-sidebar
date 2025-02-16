export enum ITEM_FLAGS {
  CREATED_AT = '__created_at',
  FRONT_MATTER = 'frontmatter',

  CONTENT_IS_EMPTY = '__content_is_empty',

  IS_GROUP = '__is_group',
}

export const ITEM_EXTRA_KEYS = Object.values(ITEM_FLAGS)

export const SIDEBAR_ITEM_KEYS = new Set(['text', 'link', 'items', 'collapsed', 'base', 'docFooterText', 'rel', 'target'])
