import parser from 'bbcode-to-react'

export function ParseCode() {
  return <p>{parser.toReact('[b]strong[/b]')}</p>
}
