import { IdasAuthResult } from '@/common/interfaces/response'

export type IdasResultEx = IdasAuthResult & {
  ticket: string
  continue: string
}
