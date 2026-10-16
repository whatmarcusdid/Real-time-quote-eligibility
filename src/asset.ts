// Figma-exported assets are bundled by Vite (small files are inlined as data URLs).
const urls = import.meta.glob('./assets/**/*.{svg,png}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

/** Resolve an asset path like "logos/chubb.png" to its bundled URL. */
export const asset = (p: string) => {
  const url = urls[`./assets/${p.replace(/^\//, '')}`]
  if (!url) throw new Error(`Missing asset: ${p}`)
  return url
}
