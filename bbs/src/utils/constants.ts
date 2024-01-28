import { TopListKey } from '@/common/interfaces/response'

export const topListTitleMap: { [key in TopListKey]: string } = {
  newreply: '最新回复',
  newthread: '最新发表',
  digest: ' 精华展示',
  life: '生活信息',
  hotlist: '今日热门',
}

export const topListTopKeys: TopListKey[] = ['newreply', 'newthread', 'digest']
export const topListSideKeys: TopListKey[] = ['life', 'hotlist']
export const topListKeys = topListTopKeys.concat(topListSideKeys)
