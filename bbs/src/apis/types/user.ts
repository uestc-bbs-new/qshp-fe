export type UserFrontendSettings = {
  user_blacklist?: { uid: number; block_replies?: boolean }[]
  forum_blacklist?: number[]
  keyword_blackilst?: { kw: string; include_summary?: boolean }[]
}
