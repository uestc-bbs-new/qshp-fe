const replace = (
  str: string,
  patterns: RegExp[],
  replacements: string | string[]
) => {
  patterns.forEach((pattern, i) => {
    const replacement =
      typeof replacements === 'string' ? replacements : replacements[i]
    str = str.replace(pattern, replacement)
  })
  return str
}

// Implemented according to https://www.php.net/manual/en/function.htmlspecialchars.php, without ENT_QUOTES.
export const htmlspecialchars = (str: string) =>
  replace(str, [/&/g, /"/g, /</g, />/g], ['&amp;', '&quot;', '&lt;', '&gt;'])

export const html = (strings: TemplateStringsArray, ...texts: string[]) => {
  return strings
    .map((chunk, i) =>
      i < texts.length ? chunk + htmlspecialchars(texts[i]) : chunk
    )
    .join('')
}
