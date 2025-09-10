import request from '@/apis/request'
import { Announcement } from '@/common/interfaces/response'

import { baseUrl } from './common'

export type AdminPermissions = {
  is_admin: boolean
  announcement?: boolean
  toplist?: boolean
  extensions?: {
    freshman?: boolean
  }
}

export const getPermissions = () =>
  request.get<AdminPermissions>(`${baseUrl}permissions`)

const kAnnouncementUrl = `${baseUrl}global/announcement`

export const getAnnouncement = () =>
  request.get<Announcement[]>(kAnnouncementUrl)
export const setAnnouncement = (list: Announcement[]) =>
  request.post(kAnnouncementUrl, list)
