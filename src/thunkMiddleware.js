const id = item => item

const thunkMiddlewareCreator = ({
  parseError = id,
  parseResponse = id,
} = {}) => ({ dispatch, getState }) => next => async action => {
  next(action)

  const { thunk, success, error } = action
  if (typeof thunk === 'function') {
    try {
      const response = await thunk(dispatch, getState)
      return dispatch(success(parseResponse(response)))
    } catch (err) {
      return dispatch(error(parseError(err)))
    }
  }
}

const thunkMiddleware = thunkMiddlewareCreator()
thunkMiddleware.withConfig = thunkMiddlewareCreator

export default thunkMiddleware
