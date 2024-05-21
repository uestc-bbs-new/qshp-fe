import { Attachment } from '@/common/interfaces/base'
import siteRoot from '@/utils/siteRoot'

import { renderAttachmentImage } from '../../../../markdown-renderer/src/renderer/renderer'
import {
  legacySmilyMaps,
  smilyMaps,
} from '../../../../markdown-renderer/src/renderer/smilyData'

const kSmilyBasePath = siteRoot + '/static/image/smiley/'

export type FontSizeVariant = 'default' | 'small'

export const mapLegacyFontSize = (
  size: string | number,
  variant?: FontSizeVariant
) => {
  variant = variant || 'default'
  const kFontSizeMap: { [size: string]: number } = {
    '1': 10,
    '2': 13,
    '3': 16,
    '4': 18,
    '5': variant == 'small' ? 22 : 24,
    '6': variant == 'small' ? 26 : 32,
    '7': variant == 'small' ? 30 : 48,
    '8': variant == 'small' ? 30 : 48, // Not standard.
    '9': variant == 'small' ? 30 : 48, // Not standard but used somewhere.
  }
  const px = kFontSizeMap[size.toString()]
  return px ? `${px}px` : '1em'
}

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
const htmlspecialchars = (str: string) => {
  return replace(
    str,
    [/&/g, /"/g, /</g, />/g],
    ['&amp;', '&quot;', '&lt;', '&gt;']
  )
}

const html = (strings: TemplateStringsArray, ...texts: string[]) => {
  return strings
    .map((chunk, i) =>
      i < texts.length ? chunk + htmlspecialchars(texts[i]) : chunk
    )
    .join('')
}

function makeUrl(url: string, text: string) {
  if (!text) {
    text = url
  }
  return `<a href="" target="_blank" rel="noreferrer noopener"`
}

const processTextFragmentsByRegEx = (
  value: string,
  regex: RegExp,
  callback: (fragment: string, match?: RegExpExecArray) => string
): string => {
  if (!value) {
    return value
  }
  regex.lastIndex = 0
  const execResult = regex.exec(value)
  if (!execResult) {
    return callback(value)
  }
  const prefix = callback(value.substring(0, execResult.index))
  const matchedOriginal = execResult[0]
  const matched = callback(matchedOriginal, execResult)
  return (
    prefix +
    matched +
    processTextFragmentsByRegEx(
      value.substring(execResult.index + matchedOriginal.length),
      regex,
      callback
    )
  )
}

function cuturl(url: string) {
  const length = 65
  let urllink =
    '<a href="' +
    (url.toLowerCase().substr(0, 4) == 'www.' ? 'http://' + url : url) +
    '" target="_blank">'
  if (url.length > length) {
    url =
      url.substr(0, Math.floor(length * 0.5)) +
      ' ... ' +
      url.substr(url.length - Math.floor(length * 0.3))
  }
  urllink += url + '</a>'
  return urllink
}

const parseTableWidth = (width?: string) => {
  const percentage = /^([0-9]+)%$/.exec(width || '')
  if (percentage) {
    const value = parseInt(percentage[1])
    if (!value) {
      return ''
    }
    return `${Math.min(98, value)}%`
  }
  if (width?.match(/^[0-9]+$/)) {
    const value = parseInt(width)
    if (!value) {
      return ''
    }
    return `${Math.min(560, value)}`
  }
  return ''
}

const parseTable = (width?: string, bgcolor?: string, str?: string) => {
  let simpleTable = false
  width = parseTableWidth(width)

  if (str === undefined) {
    return ''
  }

  if (!str.match(/\[\/tr\]|\[\/td\]/i)) {
    const rows = str.split('\n')
    let s = ''
    for (let i = 0; i < rows.length; i++) {
      s += `<tr><td>${replace(
        rows[i],
        [/\r/g, /\\\|/g, /\|/g, /\\n/g],
        ['', '&#124;', '</td><td>', '\n']
      )}</td></tr>`
    }
    str = s
    simpleTable = true
  } else {
    str = str.replace(
      /\[tr(?:=([()\s%,#\w]+))?\]\s*\[td(?:=(\d{1,4}%?))?\]/gi,
      function ($1, $2, $3) {
        return (
          '<tr' +
          ($2 ? ' style="background-color: ' + $2 + '"' : '') +
          '><td' +
          ($3 ? ' width="' + $3 + '"' : '') +
          '>'
        )
      }
    )
    str = str.replace(
      /\[tr(?:=([()\s%,#\w]+))?\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/gi,
      function ($1, $2, $3, $4, $5) {
        return (
          '<tr' +
          ($2 ? ' style="background-color: ' + $2 + '"' : '') +
          '><td' +
          ($3 ? ' colspan="' + $3 + '"' : '') +
          ($4 ? ' rowspan="' + $4 + '"' : '') +
          ($5 ? ' width="' + $5 + '"' : '') +
          '>'
        )
      }
    )
    str = str.replace(
      /\[\/td\]\s*\[td(?:=(\d{1,4}%?))?\]/gi,
      function ($1, $2) {
        return '</td><td' + ($2 ? ' width="' + $2 + '"' : '') + '>'
      }
    )
    str = str.replace(
      /\[\/td\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/gi,
      function ($1, $2, $3, $4) {
        return (
          '</td><td' +
          ($2 ? ' colspan="' + $2 + '"' : '') +
          ($3 ? ' rowspan="' + $3 + '"' : '') +
          ($4 ? ' width="' + $4 + '"' : '') +
          '>'
        )
      }
    )
    str = str.replace(/\[\/td\]\s*\[\/tr\]\s*/gi, '</td></tr>')
    str = str.replace(/<td> <\/td>/gi, '<td>&nbsp;</td>')
  }
  return `<table class="post-table${simpleTable ? ' post-simple-table' : ''}" ${
    width ? `width="${width}"` : ``
  } ${bgcolor ? `style="background-color:${bgcolor}"` : ``}>${str}</table>`
}

export type BbcodeOptions = {
  bbcodeoff?: boolean
  smileyoff?: boolean
  legacyPhpwindAt?: boolean
  legacyPhpwindCode?: boolean
  sizeVariant?: FontSizeVariant
  mode?: 'post' | 'postcomment' | 'chat'
}

const kDefaultMode = 'post'

export default function bbcode2html(
  str: string,
  options: BbcodeOptions,
  attachments?: Attachment[],
  orphanAttachments?: Attachment[]
) {
  if (options.legacyPhpwindAt) {
    str = str.replace(
      /<a href="mode\.php\?m=o&q=user&u=([0-9]+)">(@[^<]+)<\/a>/g,
      '[url=/user/$1]$2[/url]'
    )
  }

  if (!options.bbcodeoff && (options.mode ?? kDefaultMode) == 'post') {
    return processTextFragmentsByRegEx(
      str,
      /\[code\](?:\r|\n)?(.+?)\[\/code\]/gis,
      (fragment, match) => {
        if (match) {
          return html`<code class="post-code-block" style="white-space:pre-wrap"
            >${match[1]}</code
          >`
        }
        return parseNonCodeBbcode(
          fragment,
          options,
          attachments,
          orphanAttachments
        )
      }
    )
  }
  return parseNonCodeBbcode(str, options, attachments, orphanAttachments)
}

function parseNonCodeBbcode(
  str: string,
  options: BbcodeOptions,
  attachments?: Attachment[],
  orphanAttachments?: Attachment[]
) {
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')

  if (!options.smileyoff && options.mode != 'postcomment') {
    str = str.replace(
      /\[(a|s):([0-9]+)\]/g,
      (fullCode: string, codePrefix: string, code: string) => {
        let path = smilyMaps[codePrefix][code]
        if (!path && options.legacyPhpwindCode) {
          path = legacySmilyMaps[codePrefix][code]
        }
        if (path) {
          return `<img src="${kSmilyBasePath}${path}" class="smily">`
        }
        return fullCode
      }
    )
  }

  if (options.bbcodeoff) {
    if (attachments) {
      if (!orphanAttachments) {
        orphanAttachments = []
      }
      orphanAttachments.push(...attachments)
    }
  } else {
    if (options.mode != 'postcomment') {
      str = str.replace(
        /\[url\]\s*((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.)([^["']+?)\s*\[\/url\]/gi,
        function ($1, $2, $3, $4) {
          return cuturl($2 + $4)
        }
      )
      str = str.replace(
        /\[url=((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.|mailto:)?([^\r\n["']+?)\]([\s\S]+?)\[\/url\]/gi,
        '<a href="$1$3" target="_blank">$4</a>'
      )
      str = str.replace(
        /\[email\](.[^\\=[]"*)\[\/email\]/gi,
        '<a href="mailto:$1">$1</a>'
      )
      str = str.replace(
        /\[email=(.[^\\=[]"*)\](.*?)\[\/email\]/gi,
        '<a href="mailto:$1" target="_blank">$2</a>'
      )
      str = str.replace(/\[postbg\]\s*([^[<\r\n;'"?()]+?)\s*\[\/postbg\]/gi, '')
    }
    str = str.replace(
      /\[color=([\w#(),\s]+?)\]/gi,
      '<span class="post-text-color" style="color:$1">'
    )
    if (options.mode != 'postcomment') {
      str = str.replace(
        /\[backcolor=([\w#(),\s]+?)\]/gi,
        '<span class="post-bg-color" style="background-color:$1">'
      )
      str = str.replace(
        /\[size=(\d+?)\]/gi,
        (_, legacyFontSize) =>
          `<span style="font-size:${mapLegacyFontSize(
            legacyFontSize,
            options.sizeVariant
          )}">`
      )
      str = str.replace(
        /\[size=(\d+(\.\d+)?(px|pt)+?)\]/gi,
        '<span style="font-size:$1">'
      )
      str = str.replace(
        /\[font=([^[<"=]+?)\]/gi,
        '<span style="font-family:$1">'
      )
      str = str.replace(
        /\[align=([^[<"=]+?)\]/gi,
        (_, align) =>
          `<div style="text-align:${align}${
            align == 'center' ? ';text-align:-webkit-center' : ''
          }">`
      )
      str = str.replace(
        /\[p=(\d{1,2}|null), (\d{1,2}|null), (left|center|right)\]/gi,
        '<p style="line-height:$1px;text-indent:$2em;text-align:$3">'
      )
      str = str.replace(
        /\[float=left\]/gi,
        '<br style="clear:both"><span style="float:left;margin-right:5px">'
      )
      str = str.replace(
        /\[float=right\]/gi,
        '<br style="clear:both"><span style="float:right;margin-left:5px">'
      )
      str = str.replace(
        /\[quote]([\s\S]*?)\[\/quote\]\s?\s?/gi,
        '<div class="quote"><blockquote>$1</blockquote></div>\n'
      )

      const kTableRegEx =
        /\[table(?:=(\d{1,4}%?)(?:,([()%,#\w ]+))?)?\]\s*([\s\S]+?)\s*\[\/table\]/gi
      for (let i = 0; i < 4; i++) {
        str = str.replace(kTableRegEx, (_, width, bgcolor, children) =>
          parseTable(width, bgcolor, children)
        )
      }
    }

    const nonPostCommentMatches =
      options.mode == 'postcomment'
        ? []
        : [
            /\[i=s\]/g,
            /\[\/backcolor\]/g,
            /\[\/size\]/g,
            /\[\/font\]/g,
            /\[\/align\]/g,
            /\[\/p\]/g,
            /\[hr\]/g,
            /\[list\]/g,
            /\[list=1\]/g,
            /\[list=a\]/g,
            /\[list=A\]/g,
            /\s?\[\*\]/g,
            /\[\/list\]/g,
            /\[indent\]/g,
            /\[\/indent\]/g,
            /\[\/float\]/g,
          ]
    const nonPostCommentReplaces =
      options.mode == 'postcomment'
        ? []
        : [
            '<i class="post-edit-status">',
            '</span>',
            '</span>',
            '</span>',
            '</div>',
            '</p>',
            '<hr class="l">',
            '<ul>',
            '<ul class="list-type-decimal">',
            '<ul class="list-type-lower-alpha">',
            '<ul class="list-type-upper-alpha">',
            '<li>',
            '</ul>',
            '<blockquote>',
            '</blockquote>',
            '</span>',
          ]
    str = replace(
      str,
      [
        /\[\/color\]/g,
        /\[b\]/g,
        /\[\/b\]/g,
        /\[i\]/g,
        /\[\/i\]/g,
        /\[u\]/g,
        /\[\/u\]/g,
        /\[s\]/g,
        /\[\/s\]/g,
        ...nonPostCommentMatches,
      ],
      [
        '</span>',
        '<b>',
        '</b>',
        '<i>',
        '</i>',
        '<u>',
        '</u>',
        '<strike>',
        '</strike>',
        ...nonPostCommentReplaces,
      ]
    )

    if (options.legacyPhpwindCode) {
      str = replace(
        str,
        [
          /\[li\](.*?)\[\/li\]/gis,
          /\[sub\](.*?)\[\/sub\]/gis,
          /\[sup\](.*?)\[\/sup\]/gis,
          /\[strike\](.*?)\[\/strike\]/gis,
          /\[fly\](.*?)\[\/fly\]/gis,
        ],
        [
          '<li>$1</li>',
          '<sub>$1</sub>',
          '<sup>$1</sup>',
          '<strike>$1</strike>',
          '<marquee>$1</marquee>',
        ]
      )
    }

    if (options.mode != 'postcomment') {
      str = str.replace(
        /\[img\]\s*([^["<\r\n]+?)\s*\[\/img\]/gi,
        '<img src="$1" style="max-width:400px;max-width:min(400px,100%)">'
      )
      str = parseAttachments(str, options, attachments, orphanAttachments)
      str = str.replace(
        /\[img=(\d{1,4})[x|,](\d{1,4})\]\s*([^["<\r\n]+?)\s*\[\/img\]/gi,
        function (_, width, height, url) {
          return (
            '<img' +
            (width > 0 ? ' width="' + width + '"' : '') +
            (height > 0 ? ' _height="' + height + '"' : '') +
            ' src="' +
            url +
            '">'
          )
        }
      )
    }
  }

  str = str.replace(/(^|>)([^<]+)(?=<|$)/gi, function (_, $2, $3) {
    return (
      $2 +
      replace(
        $3,
        [/\t/g, / {3}/g, / {2}/g, /\r\n|\n|\r/g],
        [
          '&nbsp; &nbsp; &nbsp; &nbsp; ',
          '&nbsp; &nbsp;',
          '&nbsp;&nbsp;',
          '<br />',
        ]
      )
    )
  })

  if (orphanAttachments?.length) {
    str +=
      '<div>附件：</div>' +
      orphanAttachments.map((attach) => renderAttachment(attach)).join('<br>')
  }

  return str
}

const renderAttachment = (attach: Attachment) => {
  if (attach.is_image) {
    return renderAttachmentImage(attach)
  }
  return `<span class="attach-file"><a href="/attachment/${
    attach.attachment_id
  }">${htmlspecialchars(attach.filename)}</a></span>` // TODO: attach file
}

const parseAttachments = (
  str: string,
  options: BbcodeOptions,
  attachments?: Attachment[],
  orphanAttachments?: Attachment[]
) => {
  const aidAttachmentMap = Object.fromEntries(
    (attachments || []).map((attachment) => [
      attachment.attachment_id,
      attachment,
    ])
  )
  const aidSet = new Set(
    (attachments || []).map((attachment) => attachment.attachment_id)
  )
  const usedAttachments = new Set<number>()
  str = str.replace(
    options.legacyPhpwindCode
      ? /\[attach(?:img)?\](\d+)\[\/attach(?:img)?\]|\[p_w_upload=(\d+)\]/gi
      : /\[attach(?:img)?\](\d+)\[\/attach(?:img)?\]/gi,
    (_, aid1, aid2) => {
      const aid = aid1 || aid2
      const attach = aidAttachmentMap[aid]
      if (!attach) {
        return ''
      }
      usedAttachments.add(attach.attachment_id)
      return renderAttachment(attach)
    }
  )
  for (const aid of usedAttachments) {
    aidSet.delete(aid)
  }
  if (orphanAttachments) {
    for (const aid of aidSet) {
      orphanAttachments.push(aidAttachmentMap[aid])
    }
  }
  return str
}
