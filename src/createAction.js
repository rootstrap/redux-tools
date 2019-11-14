/**
 * Makes action creators
 *
 * @param  {string} type - Dispatched actions type
 * @return {function} Action creator
 *
 * @example
 * const loginSuccess = createAction('LOGIN_SUCCESS')
 */

export default type => {
  const action = payload => ({
    type,
    payload,
  })
  action.toString = () => type
  return action
}
