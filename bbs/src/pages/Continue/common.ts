import { IdasAuthResult } from '@/apis/auth'

export type IdasResultEx = IdasAuthResult & {
  code: string
  continue: string
  version?: string
}
