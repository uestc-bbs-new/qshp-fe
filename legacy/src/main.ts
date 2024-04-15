import Vditor from 'vditor/dist/method.min.js'

;[].forEach.call(
  document.querySelectorAll('#postlist table.plhin'),
  (post: Element) => {
    const content = post.querySelector('.pct .pcb td.t_f')
    if (!content) {
      return
    }
    const markdown = content.textContent || ''
    console.log(markdown, content)
    if (markdown) {
      content.innerHTML = '<div></div>'
      Vditor.preview(content.querySelector('div') as HTMLDivElement, markdown, {
        mode: 'light',
      })
    }
  }
)
