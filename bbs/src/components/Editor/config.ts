// TODO: How to take the @ user information to request?

const options: IOptions = {
  // change the z-index due to the mui base z-index = 1200
  fullscreen: { index: 1202 },
  hint: {
    extend: [
      {
        key: '@',
        hint: (key: string) => {
          // request username
          // return a array which has all relative username and image
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
    url: '/dev/star/api/forum/v1/global/upload/files',
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
    'link',
    'upload',
    // TODO: reveal later
    // 'record',
    'preview',
    '|',
    'undo',
    'redo',
    'fullscreen',
  ],
}

export default options
