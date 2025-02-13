import matter from 'gray-matter'

export function getFrontmatter(filepath: string) {
  const fm = matter.read(filepath)
  return fm.data
}
