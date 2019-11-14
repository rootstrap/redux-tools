import produce from 'immer'

/**
 * Reducer creator util
 *
 * @param initialState Reducer initial state
 * @param actionHandlers - An object with all the reducer handlers
 *
 * @return {function} A reducer ready to use in createStore
 *
 * @example
 * const myReducer = createReducer({}, {
 *   [loginSuccess]: (state, action) => {
 *     state.user = action.payload
 *   }
 * })
 */

export default (initialState, actionHandlers) => (
  state = initialState,
  action,
) =>
  produce(state, draft =>
    actionHandlers[action.type]
      ? actionHandlers[action.type](draft, action)
      : state,
  )
