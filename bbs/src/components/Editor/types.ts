import { PostThreadDetails } from '@/apis/thread'

export type PostEditorKind = 'newthread' | 'reply' | 'edit'

export type PostEditorValue = Partial<PostThreadDetails> & {
  quoteMessagePrepend?: string
  editingThread?: boolean
}
