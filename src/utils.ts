export function removeExtraSlash(p: string) {
  return p.replace(/\/+/g, '/')
}

export function removeSuffix(p: string) {
  return p.replace(/\.[^/.]+$/, '')
}

export function getLastSlug(url: string) {
  return url ? url.match(/\/([^/]+)\/?$/)?.[1] || url : ''
}

export function parentBase(url: string) {
  return url.match(/(.*\/)[^/]+\/?$/)?.[1] || '/'
}
