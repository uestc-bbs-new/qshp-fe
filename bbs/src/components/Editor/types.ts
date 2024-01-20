import { PostThreadDetails } from '@/apis/thread'

export type PostEditorValue = Partial<PostThreadDetails> & {
  quoteMessagePrepend?: string
  editingThread?: boolean
}
