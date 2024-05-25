import { ForumDetails } from '@/common/interfaces/forum'

export const getValidThreadTypes = (forum?: ForumDetails) =>
  forum?.thread_types?.filter(
    (item) => !item.virtual && (!item.moderators_only || forum?.can_moderate)
  ) || []
