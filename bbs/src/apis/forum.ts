import request, { commonUrl } from '@/apis/request'

export const payForum = (fid: number) =>
  request.post(`${commonUrl}/forum/pay`, undefined, {
    params: {
      forum_id: fid,
    },
  })
