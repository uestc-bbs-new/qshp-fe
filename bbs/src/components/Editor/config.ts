// TODO: How to take the @ user information to request?

const options: IOptions = {
  height: 300,
  // change the z-index due to the mui base z-index = 1200
  fullscreen: { index: 1202 },
  hint: {
    extend: [
      {
        key: '@',
        hint: (key: string) => {
          if ('vanessa'.indexOf(key.toLocaleLowerCase()) > -1) {
            return [
              {
                value: '@Vanessa',
                html: '<img src="https://avatars0.githubusercontent.com/u/970828?s=60&v=4"/> Vanessa',
              },
            ]
          }
          return []
        },
      },
    ],
  },
  upload: {
    accept: 'image/*,.mp3, .wav, .rar',
    token: 'test',
    url: '/api/upload/editor',
    linkToImgUrl: '/api/upload/fetch',
    filename(name) {
      return name
        .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\\.)]/g, '')
        .replace(/[\\?\\/:|<>\\*\\[\]\\(\\)\\$%\\{\\}@~]/g, '')
        .replace('/\\s/g', '')
    },
  },
  counter: {
    enable: true,
    type: 'text',
  },

  // toolbar display config
  toolbar: [
    'edit-mode',
    'outline',
    '|',
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    '|',
    'line',
    'quote',
    'table',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    'code',
    'inline-code',
    'insert-after',
    'insert-before',
    '|',
    'upload',
    'link',
    // 'record',
    'preview',
    '|',
    'undo',
    'redo',
    'fullscreen',
    // '|',
    // 'code-theme',
    // 'content-theme',
    // 'br',
    // 'export',
    // 'devtools',
    // 'info',
  ],
}

export default options
