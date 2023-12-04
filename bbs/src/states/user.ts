import { UserState } from './reducers/stateReducer'

type UserCallback = (state?: UserState) => void

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

const notifyUserCallbacks = (newUser?: UserState) => {
  userCallbacks.forEach((callback) => callback(newUser))
}

export { registerUserCallback, unregisterUserCallback, notifyUserCallbacks }
