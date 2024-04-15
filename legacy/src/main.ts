;[].forEach.call(
  document.querySelectorAll('#postlist table.plhin'),
  (post: Element) => {
    console.log(post.querySelector('.pct .pcb td.t_f')?.textContent)
  }
)
