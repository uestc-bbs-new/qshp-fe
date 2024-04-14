import { AxiosProgressEvent } from 'axios'

import { UploadResponse } from '@/common/interfaces/base'
import { Forum, ForumDetails } from '@/common/interfaces/forum'
import {
  IndexData,
  Thread,
  ThreadList,
  TopList,
} from '@/common/interfaces/response'
import { ThreadTypeMap } from '@/common/interfaces/thread'
import { unescapeSubject } from '@/utils/htmlEscape'
import request, { authServiceWithUser, commonUrl } from '@/utils/request'

import registerAuthAdoptLegacyInterceptors from './interceptors/authAdoptLegacy'
import registerAuthHeaderInterceptors from './interceptors/authHeader'
import registerUserInterceptors from './interceptors/user'
import registerSystemInterceptors from './interceptors/user'

registerAuthHeaderInterceptors(request)
registerAuthAdoptLegacyInterceptors(request.axios)
registerUserInterceptors(request)
registerUserInterceptors(authServiceWithUser)
registerSystemInterceptors(request)
registerSystemInterceptors(authServiceWithUser)

export const makeThreadTypesMap = (forum?: ForumDetails) => {
  if (forum && forum.thread_types) {
    forum.thread_types_map = forum.thread_types.reduce<ThreadTypeMap>(
      (map, item) => {
        map[item.type_id] = item
        return map
      },
      {}
    )
  }
}

export const getForumList = () => {
  return request.get<Forum[]>(`${commonUrl}/forum/list`)
}
export const getForumDetails = (forum_id: string) => {
  return request.get<ForumDetails>(`${commonUrl}/forum/details`, {
    params: {
      forum_id,
    },
  })
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/global/thread/bulletin`, {
    params: params,
  })
}

const normalizeStringArray = (value: string | string[]) => {
  if (typeof value === 'string') {
    return [value]
  }
  return value
}
const transformTopList = (result: TopList) => {
  for (const [_, v] of Object.entries(result)) {
    v?.forEach(
      (thread) =>
        (thread.subject = unescapeSubject(
          thread.subject,
          thread.dateline,
          true
        ))
    )
  }
  return result
}
export const getTopLists = async (ids: string | string[]) =>
  transformTopList(
    await request.get<TopList>(`${commonUrl}/forum/toplist`, {
      params: { idlist: normalizeStringArray(ids).join(',') },
    })
  )

export const getIndexData = async ({
  globalStat,
  forumList,
  topList,
}: {
  globalStat?: boolean
  forumList?: boolean
  topList?: string | string[]
}) => {
  const result = await request.get<IndexData>(`${commonUrl}/index`, {
    params: {
      ...(globalStat && { global_stat: 1 }),
      ...(forumList && { forum_list: 1 }),
      ...(topList && { top_list: normalizeStringArray(topList).join(',') }),
    },
  })
  result.top_list && transformTopList(result.top_list)
  return result
}

export const getThreadList = async (params: {
  forum_id: number
  page: number
  sort_by?: number
  type_id?: number
  forum_details?: boolean
}) => {
  const result = await request.get<ThreadList>(`${commonUrl}/thread/list`, {
    params: {
      ...params,
      forum_details: params.forum_details ? 1 : 0,
    },
  })
  makeThreadTypesMap(result.forum)
  result.rows?.forEach((item) => {
    item.subject = unescapeSubject(item.subject, item.dateline, true)
  })
  return result
}

export const getAnnouncement = () => {
  return request.get<Thread[]>(`${commonUrl}/view/thread/bulletin`)
}

export const uploadAttachment = (
  kind: 'forum' | 'chat',
  type: 'image' | 'file',
  files: File[],
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData()
  formData.append('kind', kind)
  formData.append('type', type)
  files.forEach((file) => formData.append('files[]', file))
  return request.postForm<UploadResponse>(
    `${commonUrl}/attachment/upload`,
    formData,
    {
      onUploadProgress: onProgress,
    }
  )
}
