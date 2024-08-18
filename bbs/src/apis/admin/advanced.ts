import request from '@/apis/request'

import { baseUrl } from './common'

export const setCookie = (list: { name: string; value: string }[]) =>
  request.post(`${baseUrl}global/announcement`, list)
