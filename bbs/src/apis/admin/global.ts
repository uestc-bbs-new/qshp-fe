import request from '@/apis/request'
import { Announcement } from '@/common/interfaces/response'

import { baseUrl } from './common'

const kAnnouncementUrl = `${baseUrl}global/announcement`

export const getAnnouncement = () =>
  request.get<Announcement[]>(kAnnouncementUrl)
export const setAnnouncement = (list: Announcement[]) =>
  request.post(kAnnouncementUrl, list)
