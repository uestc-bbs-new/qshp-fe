import { PostThreadDetails } from '@/apis/thread'
import { Attachment } from '@/common/interfaces/base'

export type PostEditorKind = 'newthread' | 'reply' | 'edit'

export type PostEditorValue = Partial<PostThreadDetails> & {
  quoteMessagePrepend?: string
  editingThread?: boolean
}

export type EditorAttachment = Attachment & {
  deleted?: boolean
  orphan?: boolean
}
