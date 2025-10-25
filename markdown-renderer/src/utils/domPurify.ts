export const config: DOMPurify.Config = {
  FORBID_TAGS: ['input', 'button', 'select', 'textarea', 'datalist', 'form'],
  FORBID_ATTR: ['name', 'id'],
}
