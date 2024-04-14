import { IdasAuthResult } from '@/common/interfaces/response'

export type IdasResultEx = IdasAuthResult & {
  code: string
  continue: string
  version?: string
}
