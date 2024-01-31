/* eslint-disable no-control-regex */

/* eslint-disable no-empty */

/* eslint-disable no-redeclare */

/* eslint-disable no-useless-escape */

/*
	[Discuz!] (C)2001-2099 Comsenz Inc.
	This is NOT a freeware, use is subject to license terms

	$Id: bbcode.js 36359 2017-01-20 05:06:45Z nemohou $
*/
import siteRoot from '@/utils/siteRoot'

import { smilies_array, smilies_type } from './config'

var EXTRAFUNC = [],
  allowsmilies = true,
  parsetype = 0,
  allowbbcode = true,
  allowimgcode = true,
  EXTRASTR = '',
  wysiwyg = 1

// 资源文件地址
var STATICURL = siteRoot + '/static/' // 站点静态文件路径，“/”结尾

var $ = function (id) {
  return typeof id === 'string' ? document.getElementById(id) : id
}

var re,
  DISCUZCODE = []
DISCUZCODE['num'] = '-1'
DISCUZCODE['html'] = []
EXTRAFUNC['bbcode2html'] = []
EXTRAFUNC['html2bbcode'] = []

function clearcode(str) {
  str = str.replace(/\[url\]\[\/url\]/gi, '', str)
  str = str.replace(
    /\[url=((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.|mailto:)?([^\s\[\"']+?)\]\[\/url\]/gi,
    '',
    str
  )
  str = str.replace(/\[email\]\[\/email\]/gi, '', str)
  str = str.replace(/\[email=(.[^\[]*)\]\[\/email\]/gi, '', str)
  str = str.replace(/\[color=([^\[\<]+?)\]\[\/color\]/gi, '', str)
  str = str.replace(/\[size=(\d+?)\]\[\/size\]/gi, '', str)
  str = str.replace(/\[size=(\d+(\.\d+)?(px|pt)+?)\]\[\/size\]/gi, '', str)
  str = str.replace(/\[font=([^\[\<]+?)\]\[\/font\]/gi, '', str)
  str = str.replace(/\[align=([^\[\<]+?)\]\[\/align\]/gi, '', str)
  str = str.replace(
    /\[p=(\d{1,2}), (\d{1,2}), (left|center|right)\]\[\/p\]/gi,
    '',
    str
  )
  str = str.replace(/\[float=([^\[\<]+?)\]\[\/float\]/gi, '', str)
  str = str.replace(/\[quote\]\[\/quote\]/gi, '', str)
  str = str.replace(/\[code\]\[\/code\]/gi, '', str)
  str = str.replace(/\[table\]\[\/table\]/gi, '', str)
  str = str.replace(/\[free\]\[\/free\]/gi, '', str)
  str = str.replace(/\[b\]\[\/b]/gi, '', str)
  str = str.replace(/\[u\]\[\/u]/gi, '', str)
  str = str.replace(/\[i\]\[\/i]/gi, '', str)
  str = str.replace(/\[s\]\[\/s]/gi, '', str)
  return str
}

function cuturl(url) {
  var length = 65
  var urllink =
    '<a href="' +
    (url.toLowerCase().substr(0, 4) == 'www.' ? 'http://' + url : url) +
    '" target="_blank">'
  if (url.length > length) {
    url =
      url.substr(0, parseInt(length * 0.5)) +
      ' ... ' +
      url.substr(url.length - parseInt(length * 0.3))
  }
  urllink += url + '</a>'
  return urllink
}

function codetag(text, br) {
  var br = !br ? 1 : br
  DISCUZCODE['num']++
  if (br > 0 && typeof wysiwyg != 'undefined' && wysiwyg)
    text = text.replace(/<br[^\>]*>/gi, '\n')
  text = text.replace(/\$/gi, '$$')
  DISCUZCODE['html'][DISCUZCODE['num']] = '[code]' + text + '[/code]'
  return '[\tDISCUZ_CODE_' + DISCUZCODE['num'] + '\t]'
}

function isUndefined(variable) {
  return typeof variable == 'undefined' ? true : false
}

function in_array(needle, haystack) {
  if (typeof needle == 'string' || typeof needle == 'number') {
    for (var i in haystack) {
      if (haystack[i] == needle) {
        return true
      }
    }
  }
  return false
}

function parseurl(str, mode, parsecode) {
  if (isUndefined(parsecode)) parsecode = true
  if (parsecode)
    str = str.replace(/\[code\]([\s\S]+?)\[\/code\]/gi, function ($1, $2) {
      return codetag($2, -1)
    })
  str = str.replace(
    /([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(swf|flv))/gi,
    '$1[flash]$2[/flash]'
  )
  str = str.replace(
    /([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(mp3|wma))/gi,
    '$1[audio]$2[/audio]'
  )
  str = str.replace(
    /([^>=\]"'\/@]|^)((((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k|thunder|qqdl|synacast):\/\/))([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&;~`@':+!#]*)*)/gi,
    mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]'
  )
  str = str.replace(
    /([^\w>=\]"'\/@]|^)((www\.)([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&;~`@':+!#]*)*)/gi,
    mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]'
  )
  str = str.replace(
    /([^\w->=\]:"'\.\/]|^)(([\-\.\w]+@[\.\-\w]+(\.\w+)+))/gi,
    mode == 'html' ? '$1<a href="mailto:$2">$2</a>' : '$1[email]$2[/email]'
  )
  if (parsecode) {
    for (var i = 0; i <= DISCUZCODE['num']; i++) {
      str = str.replace('[\tDISCUZ_CODE_' + i + '\t]', DISCUZCODE['html'][i])
    }
  }
  return str
}

function preg_quote(str) {
  return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1')
}

function strpos(haystack, needle, _offset) {
  if (isUndefined(_offset)) {
    _offset = 0
  }

  var _index = haystack.toLowerCase().indexOf(needle.toLowerCase(), _offset)

  return _index == -1 ? false : _index
}

function parsetable(width, bgcolor, str) {
  var i = 0
  var simple = ''
  if (isUndefined(width)) {
    var width = ''
  } else {
    try {
      width =
        width.substr(width.length - 1, width.length) == '%'
          ? width.substr(0, width.length - 1) <= 98
            ? width
            : '98%'
          : width <= 560
            ? width
            : '98%'
    } catch (e) {
      width = ''
    }
  }
  if (isUndefined(str)) {
    return
  }

  if (strpos(str, '[/tr]') === false && strpos(str, '[/td]') === false) {
    var rows = str.split('\n')
    var s = ''
    for (i = 0; i < rows.length; i++) {
      s +=
        '<tr><td>' +
        preg_replace(
          ['\r', '\\\\\\|', '\\|', '\\\\n'],
          ['', '&#124;', '</td><td>', '\n'],
          rows[i]
        ) +
        '</td></tr>'
    }
    str = s
    simple = ' simpletable'
  } else {
    simple = ''
    str = str.replace(
      /\[tr(?:=([\(\)\s%,#\w]+))?\]\s*\[td(?:=(\d{1,4}%?))?\]/gi,
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
      /\[tr(?:=([\(\)\s%,#\w]+))?\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/gi,
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
  return (
    '<table ' +
    (width == '' ? '' : 'width="' + width + '" ') +
    'class="t_table"' +
    (isUndefined(bgcolor) ? '' : ' style="background-color: ' + bgcolor + '"') +
    simple +
    '>' +
    str +
    '</table>'
  )
}

function parsecode(text) {
  DISCUZCODE['num']++
  DISCUZCODE['html'][DISCUZCODE['num']] =
    '<div class="blockcode"><blockquote>' +
    htmlspecialchars(text) +
    '</blockquote></div>'
  return '[\tDISCUZ_CODE_' + DISCUZCODE['num'] + '\t]'
}

function preg_replace(search, replace, str, regswitch) {
  var regswitch = !regswitch ? 'ig' : regswitch
  var len = search.length
  for (var i = 0; i < len; i++) {
    re = new RegExp(search[i], regswitch)
    str = str.replace(
      re,
      typeof replace == 'string'
        ? replace
        : replace[i]
          ? replace[i]
          : replace[0]
    )
  }
  return str
}

function htmlspecialchars(str) {
  return preg_replace(
    ['&', '<', '>', '"'],
    ['&amp;', '&lt;', '&gt;', '&quot;'],
    str
  )
}

export default function bbcode2html(str, options) {
  if (str == '') {
    return ''
  }

  if (typeof parsetype == 'undefined') {
    parsetype = 0
  }

  if (!options.bbcodeoff && allowbbcode && parsetype != 1) {
    str = str.replace(/\[code\]([\s\S]+?)\[\/code\]/gi, function ($1, $2) {
      return parsecode($2)
    })
  }

  if (options.allowimgurl) {
    str = str.replace(
      /([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(jpg|gif|png|bmp))/gi,
      '$1[img]$2[/img]'
    )
  }

  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  if (!options.parseurloff) {
    str = parseurl(str, 'html', false)
  }

  for (i in EXTRAFUNC['bbcode2html']) {
    EXTRASTR = str
    try {
      eval('str = ' + EXTRAFUNC['bbcode2html'][i] + '()')
    } catch (e) {}
  }

  if (!options.smileyoff && allowsmilies) {
    if (typeof smilies_type == 'object') {
      for (var typeid in smilies_array) {
        for (var page in smilies_array[typeid]) {
          for (var i in smilies_array[typeid][page]) {
            re = new RegExp(preg_quote(smilies_array[typeid][page][i][1]), 'g')
            str = str.replace(
              re,
              '<img src="' +
                STATICURL +
                'image/smiley/' +
                smilies_type['_' + typeid][1] +
                '/' +
                smilies_array[typeid][page][i][2] +
                '" border="0" smilieid="' +
                smilies_array[typeid][page][i][0] +
                '" alt="' +
                smilies_array[typeid][page][i][1] +
                '" />'
            )
          }
        }
      }
    }
  }

  if (!options.bbcodeoff && allowbbcode) {
    str = clearcode(str)
    str = str.replace(
      /\[url\]\s*((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.)([^\[\"']+?)\s*\[\/url\]/gi,
      function ($1, $2, $3, $4) {
        return cuturl($2 + $4)
      }
    )
    str = str.replace(
      /\[url=((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|thunder|qqdl|synacast){1}:\/\/|www\.|mailto:)?([^\r\n\[\"']+?)\]([\s\S]+?)\[\/url\]/gi,
      '<a href="$1$3" target="_blank">$4</a>'
    )
    str = str.replace(
      /\[email\](.[^\\=[]*)\[\/email\]/gi,
      '<a href="mailto:$1">$1</a>'
    )
    str = str.replace(
      /\[email=(.[^\\=[]*)\](.*?)\[\/email\]/gi,
      '<a href="mailto:$1" target="_blank">$2</a>'
    )
    str = str.replace(
      /\[postbg\]\s*([^\[\<\r\n;'\"\?\(\)]+?)\s*\[\/postbg\]/gi,
      function ($1, $2) {
        var addCSS = ''
        // 关闭背景图片
        // if (in_array($2, postimg_type['postbg'])) {
        //   addCSS =
        //     '<style type="text/css" name="editorpostbg">body{background-image:url("' +
        //     STATICURL +
        //     'image/postbg/' +
        //     $2 +
        //     '");}</style>'
        // }
        return addCSS
      }
    )
    str = str.replace(/\[color=([\w#\(\),\s]+?)\]/gi, '<font color="$1">')
    str = str.replace(
      /\[backcolor=([\w#\(\),\s]+?)\]/gi,
      '<font style="background-color:$1">'
    )
    str = str.replace(/\[size=(\d+?)\]/gi, '<font size="$1">')
    str = str.replace(
      /\[size=(\d+(\.\d+)?(px|pt)+?)\]/gi,
      '<font style="font-size: $1">'
    )
    str = str.replace(/\[font=([^\[\<\=]+?)\]/gi, '<font face="$1">')
    str = str.replace(/\[align=([^\[\<\=]+?)\]/gi, '<div align="$1">')
    str = str.replace(
      /\[p=(\d{1,2}|null), (\d{1,2}|null), (left|center|right)\]/gi,
      '<p style="line-height: $1px; text-indent: $2em; text-align: $3;">'
    )
    str = str.replace(
      /\[float=left\]/gi,
      '<br style="clear: both"><span style="float: left; margin-right: 5px;">'
    )
    str = str.replace(
      /\[float=right\]/gi,
      '<br style="clear: both"><span style="float: right; margin-left: 5px;">'
    )
    if (parsetype != 1) {
      str = str.replace(
        /\[quote]([\s\S]*?)\[\/quote\]\s?\s?/gi,
        '<div class="quote"><blockquote>$1</blockquote></div>\n'
      )
    }

    re =
      /\[table(?:=(\d{1,4}%?)(?:,([\(\)%,#\w ]+))?)?\]\s*([\s\S]+?)\s*\[\/table\]/gi
    for (i = 0; i < 4; i++) {
      str = str.replace(re, function ($1, $2, $3, $4) {
        return parsetable($2, $3, $4)
      })
    }

    str = preg_replace(
      [
        '\\[\\/color\\]',
        '\\[\\/backcolor\\]',
        '\\[\\/size\\]',
        '\\[\\/font\\]',
        '\\[\\/align\\]',
        '\\[\\/p\\]',
        '\\[b\\]',
        '\\[\\/b\\]',
        '\\[i\\]',
        '\\[i=s\\]',
        '\\[\\/i\\]',
        '\\[u\\]',
        '\\[\\/u\\]',
        '\\[s\\]',
        '\\[\\/s\\]',
        '\\[hr\\]',
        '\\[list\\]',
        '\\[list=1\\]',
        '\\[list=a\\]',
        '\\[list=A\\]',
        '\\s?\\[\\*\\]',
        '\\[\\/list\\]',
        '\\[indent\\]',
        '\\[\\/indent\\]',
        '\\[\\/float\\]',
      ],
      [
        '</font>',
        '</font>',
        '</font>',
        '</font>',
        '</div>',
        '</p>',
        '<b>',
        '</b>',
        '<i>',
        '<i class="post_edit_status">',
        '</i>',
        '<u>',
        '</u>',
        '<strike>',
        '</strike>',
        '<hr class="l" />',
        '<ul>',
        '<ul type=1 class="litype_1">',
        '<ul type=a class="litype_2">',
        '<ul type=A class="litype_3">',
        '<li>',
        '</ul>',
        '<blockquote>',
        '</blockquote>',
        '</span>',
      ],
      str,
      'g'
    )
  }

  if (!options.bbcodeoff) {
    if (allowimgcode) {
      str = str.replace(
        /\[img\]\s*([^\[\"\<\r\n]+?)\s*\[\/img\]/gi,
        '<img src="$1" border="0" alt="" style="max-width:400px" />'
      )
      str = str.replace(
        /\[attachimg\](\d+)\[\/attachimg\]/gi,
        function ($1, $2) {
          if (!$('image_' + $2)) {
            return ''
          }
          var width = $('image_' + $2).getAttribute('cwidth')
          if (!width) {
            re = /cwidth=(["']?)(\d+)(\1)/i
            var matches = re.exec($('image_' + $2).outerHTML)
            if (matches != null) {
              width = matches[2]
            }
          }
          return (
            '<img src="' +
            $('image_' + $2).src +
            '" border="0" aid="attachimg_' +
            $2 +
            '" width="' +
            width +
            '" alt="" />'
          )
        }
      )
      str = str.replace(
        /\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\"\<\r\n]+?)\s*\[\/img\]/gi,
        function ($1, $2, $3, $4) {
          return (
            '<img' +
            ($2 > 0 ? ' width="' + $2 + '"' : '') +
            ($3 > 0 ? ' _height="' + $3 + '"' : '') +
            ' src="' +
            $4 +
            '" border="0" alt="" />'
          )
        }
      )
    } else {
      str = str.replace(
        /\[img\]\s*([^\[\"\<\r\n]+?)\s*\[\/img\]/gi,
        '<a href="$1" target="_blank">$1</a>'
      )
      str = str.replace(
        /\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\"\<\r\n]+?)\s*\[\/img\]/gi,
        '<a href="$3" target="_blank">$3</a>'
      )
    }
  }

  str = str.replace(/(^|>)([^<]+)(?=<|$)/gi, function ($1, $2, $3) {
    return (
      $2 +
      preg_replace(
        ['\t', '   ', '  ', '(\r\n|\n|\r)'],
        [
          '&nbsp; &nbsp; &nbsp; &nbsp; ',
          '&nbsp; &nbsp;',
          '&nbsp;&nbsp;',
          '<br />',
        ],
        $3
      )
    )
  })

  return str
}
