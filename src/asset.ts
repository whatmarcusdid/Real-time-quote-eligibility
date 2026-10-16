/** Resolve a file in /public against the build-time base path. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
