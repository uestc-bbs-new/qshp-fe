import { BBSInfo, ForumList, Thread, ThreadList } from '@/common/interfaces/response'
import request from '@/utils/request'


const commonUrl = ''

export const getForumList = () => {
  return request.get<null, ForumList>(`${commonUrl}/star/api/forum/v1/global/forum/forum-list`)
}

export const getBulletin = (params: object) => {
  return request.get(`${commonUrl}/thread/bulletin`, { params: params })
}

export const getHotThread = (params: object) => {
  return request.post<object, { threads: Thread[] }>(
    `${commonUrl}/read/thread/hot`,
    params
  )
}

export const getBBSInfo = () => {
  return request.get<null, BBSInfo>(`${commonUrl}/forum/bbs-info`)
}

export const searchThreads = (params: object) => {
  return request.post<object, { resultNum: number; threads: Thread[] }>(
    `${commonUrl}/thread/search`,
    params
  )
}

export const getThreadList = (params: object) => {
  return request.get<null, ThreadList>(
    `${commonUrl}/star/api/forum/v1/view/thread/threads`,
    { params: params,
      headers:{
        Authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMDY5MjUsInVzZXJuYW1lIjoiQWJyYUMiLCJ1c2VyX2dyb3VwIjoyNiwiYWRtaW5fZ3JvdXAiOjMsImV4dGVuZGVkX2dyb3VwcyI6WzI2LDNdLCJ2aWV3X2F1dGhvcml0aWVzIjpbMiwxNywyNSw0NSw0Niw1NSw2MSw2Niw3MCw3NCwxMTEsMTE0LDExNSwxMTgsMTIxLDEyOCwxMzgsMTQwLDE0OSwxNTIsMTU0LDE4MywxOTksMjA4LDIyNSwyMjksMjMzLDIzNiwyMzcsMjUyLDI1NSwzMDUsMzA5LDMxMiwzMjYsMzcwLDM4MiwzOTEsNDAzXSwiYXVkIjoid2ViIiwiZXhwIjoxNjk1NjI4MjU3LCJqdGkiOiIzMDA1MzEyMzU5MDQ1NTI5NyIsImlhdCI6MTY5MDQ0NDI1NywiaXNzIjoi5riF5rC05rKz55WU4oCU4oCU55S15a2Q56eR5oqA5aSn5a2m5a6Y5pa56K665Z2bIiwic3ViIjoiYWNjZXNzX3Rva2VuIn0.ozcDENGOCKW4yps8v7g6GSfmAHb22yzW-doUCd-Ec_g',
      }
    }

  )
};