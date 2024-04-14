export type ThumbnailVariant = 'content' | 'summary' | 'original'
export const setVariantForThumbnailUrl = (
  url: string,
  variant: ThumbnailVariant
) => {
  const i = url.indexOf('?')
  // |variant| is simple constant strings, which does not need url-encoding.
  const value = 'variant=' + variant
  if (i == -1) {
    return url + '?' + value
  }
  if (i == url.length - 1) {
    return url + value
  }
  return url + '&' + value
}
