import { SUCCESS, ERROR, REQUEST, RESET } from './constants'
import createAction from './createAction'

/**
 * Creates different actions creators
 *
 * @param {string} actionName - Action name, will be used as a prefix for the action creators.
 * @param {function} thunk - This is your async thunk
 *
 * @returns {ActionCreator} Action that can be dispatched to start the async thunk, can also be
 * deconstructed to get request, error, and success action creators (can be used as keys in reducer)
 *
 * @example
 * export const getProfile = createActionWithThunk(
 *  'LOGIN',
 *   user => userService.login(user),
 * );
 * export const { success, error } = getProfile;
 */

export default (actionName, thunk) => {
  const request = createAction(`${actionName}_${REQUEST}`)
  const error = createAction(`${actionName}_${ERROR}`)
  const success = createAction(`${actionName}_${SUCCESS}`)
  const reset = createAction(`${actionName}_${RESET}`)

  const action = (...params) => ({
    success,
    error,
    thunk: () => thunk(...params),
    type: request.toString(),
  })

  action.request = request
  action.error = error
  action.success = success
  action.reset = reset
  action.toString = () => actionName

  return action
}
