export const SEP = '/'

export function removeExtraSlash(p: string) {
  return p.replace(/\/+$/, SEP)
}

function flink(p?: string): string {
  if (!p)
    return ''
  const link = p.startsWith(SEP) ? p : `${SEP}${p}`
  return link.endsWith(SEP) ? link.slice(0, -1) : link
}

export function normalizeLink(...paths: string[]) {
  return paths.map(flink).filter(Boolean).join('')
}

export function normalizeBase(...paths: string[]) {
  return `${normalizeLink(...paths)}${SEP}`
}

export function getLastSlug(url: string) {
  return url ? url.match(/\/([^/]+)\/?$/)?.[1] || url : ''
}

export function parentBase(p: string) {
  return p.match(/(.*\/)[^/]+\/?$/)?.[1] || '/'
}

export function removeSuffix(p: string) {
  return p.replace(/\.md$/, '')
}

export function assign(target: Record<string, any>, source: any) {
  if (!source || source === null || typeof source !== 'object') {
    return target
  }

  Object.assign(target, source)
}
