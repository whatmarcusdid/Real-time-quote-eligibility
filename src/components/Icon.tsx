import { asset } from '../asset'
/** Figma-exported SVG/PNG assets live in /public/figma. Decorative unless alt given. */
export function Img({ src, alt = '', className, width, height }: { src: string; alt?: string; className?: string; width?: number; height?: number }) {
  return <img src={asset(src)} alt={alt} aria-hidden={alt ? undefined : true} className={className} width={width} height={height} />
}
