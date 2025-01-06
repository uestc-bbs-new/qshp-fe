import React from 'react'

import { StateAction } from '@/states/reducers/stateReducer'

import { ExtCreditsUpdateResponse, extCreditNames } from '../interfaces/base'

export const notifyCreditsUpdate = (
  dispatch: React.Dispatch<StateAction>,
  response?: ExtCreditsUpdateResponse,
  delayMs?: number
) => {
  if (response?.ext_credits_update) {
    const updates = response.ext_credits_update
    let hasNegative = false
    const message = extCreditNames
      .map((k) => {
        const v = updates[k]
        if (!v) {
          return ''
        }
        if (v < 0) {
          hasNegative = true
        }
        return `${k} ${v > 0 ? `+${v}` : v}`
      })
      .filter((text) => !!text)
      .join('，')
    if (message) {
      setTimeout(() => {
        dispatch({
          type: 'open snackbar',
          payload: {
            severity: hasNegative ? 'warning' : 'success',
            message,
          },
        })
      }, delayMs ?? 0)
    }
  }
}
