export default ({ dispatch, getState }) => next => async action => {
  next(action)

  const { thunk, success, error } = action
  if (typeof thunk === 'function') {
    try {
      const response = await thunk(dispatch, getState)
      dispatch(success(response))
    } catch (err) {
      dispatch(error(err))
    }
  }
}
