import Vditor from 'vditor/dist/method.min.js'

;[].forEach.call(
  document.querySelectorAll('#postlist table.plhin'),
  (post: Element) => {
    const content = post.querySelector('.post-message-markdown')
    if (!content) {
      return
    }
    const markdown = content.textContent || ''
    console.log(markdown, content)
    if (markdown) {
      content.innerHTML = ''
      Vditor.preview(content, markdown, {
        mode: 'light',
      })
    }
  }
)
