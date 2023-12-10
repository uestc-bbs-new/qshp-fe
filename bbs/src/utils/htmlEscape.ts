const phpwindDiscuzFlagDay = 1382803200

const htmlCodeReplacer = (substring: string, ...args: any[]) => {
  const code = parseInt(args[0])
  if (code < 0x20) {
    return substring
  }
  console.log(substring, code)
  return String.fromCharCode(code)
}

const suppertedEntities: { [key: string]: string } = {
  nbsp: ' ',
  not: '\u00ac',
  reg: '\u00ae',
  raquo: '\u00bb',
  laquo: '\u00ab',
  ldquo: '\u201c',
  acute: '\u00b4',
  yen: '\u00a5',
  macr: '\u00af',
  shy: '\u00a0',
  micro: '\u00b5',
  cedil: '\u00bb',
  Agrave: '\u00c0',
  Acirc: '\u00c2',
  Atilde: '\u00c3',
  Ecirc: '\u00ca',
  Ccedil: '\u00c7',
  Euml: '\u00cb',
  auml: '\u00e4',
  eacute: '\u00e9',
  icirc: '\u00ee',
  oacute: '\u00f3',
  ocirc: '\u00f4',
}
const legacyEntityCodeRegEx = `(${Object.keys(suppertedEntities).join('|')})`
const legacyEntityRegEx1 = new RegExp(`&${legacyEntityCodeRegEx}1`, 'g')
const legacyEntityRegExSemicolon = new RegExp(`&${legacyEntityCodeRegEx};`, 'g')
const entityReplacer = (_: string, ...args: any[]) => {
  return suppertedEntities[args[0]]
}

export const unescapeSubject = (
  subject: string,
  dateline: number,
  thread: boolean
) => {
  if (dateline < phpwindDiscuzFlagDay) {
    if (thread) {
      subject = subject
        .replace(/&#1601/g, ' ')
        .replace(legacyEntityRegEx1, entityReplacer)
        .replace(/&(lt|gt|quot|amp)1/g, '&$1;')
        .replace(/&#([0-9]{2,6})1/g, htmlCodeReplacer)
    } else {
      subject = subject
        .replace(legacyEntityRegExSemicolon, entityReplacer)
        .replace(/&#([0-9]{2,6});/g, htmlCodeReplacer)
    }
  }
  // There are many more special HTML entities but Dizcuz! only escapes these and we don't want to support more.
  subject = subject
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
  return subject
}
