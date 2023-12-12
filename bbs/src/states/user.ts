import { UserState } from './reducers/stateReducer'

export type UserCallbackDetails = {
  user?: UserState
  requireSignIn?: boolean
}

type UserCallback = (details: UserCallbackDetails) => void

const userCallbacks: Array<UserCallback> = []

const registerUserCallback = (callback: UserCallback) => {
  userCallbacks.push(callback)
}

const unregisterUserCallback = (callback: UserCallback) => {
  const index = userCallbacks.indexOf(callback)
  if (index != -1) {
    userCallbacks.splice(index, 1)
  }
}

const notifyUserCallbacks = (details: UserCallbackDetails) => {
  userCallbacks.forEach((callback) => callback(details))
}

export { registerUserCallback, unregisterUserCallback, notifyUserCallbacks }
