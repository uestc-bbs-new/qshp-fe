import Vditor from 'vditor'

import { Attachment } from '@/common/interfaces/base'

export type VditorContext = {
  vditor?: Vditor
  attachments: Attachment[]
}
