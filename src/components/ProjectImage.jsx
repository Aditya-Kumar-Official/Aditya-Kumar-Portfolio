/* Responsive WebP with explicit dimensions (no layout shift). Files are <base>-800.webp and -1400.webp. */
export default function ProjectImage({ image, sizes, eager = false, className = '' }) {
  return (
    <img
      src={`${image.base}-1400.webp`} srcSet={`${image.base}-800.webp 800w, ${image.base}-1400.webp 1400w`} sizes={sizes}
      alt={image.alt} width={image.width} height={image.height}
      loading={eager ? 'eager' : 'lazy'} decoding="async" className={`block h-auto w-full ${className}`}
    />
  );
}
