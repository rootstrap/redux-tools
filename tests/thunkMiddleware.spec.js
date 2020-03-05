import configureStore from 'redux-mock-store'

import thunkMiddleware from '../src/thunkMiddleware'
import createThunk from '../src/createThunk'

const parseError = error => error.toString()
let mockStore = configureStore([thunkMiddleware()])

describe('actionThunk Middleware', () => {
  let store
  let mockErrorAction
  let mockSuccessAction

  const error = new Error('testing')
  const success = 'Yay!'

  beforeEach(() => {
    store = mockStore({})
    mockErrorAction = createThunk('error', () => {
      throw error
    })
    mockSuccessAction = createThunk('success', () => {
      return success
    })
  })

  describe('when dispatching any action', () => {
    it('the action should not be dismissed', () => {
      store.dispatch(mockSuccessAction())
      const actions = store.getActions()
      expect(actions[0]).toHaveProperty(
        'type',
        mockSuccessAction.request.toString(),
      )
    })
  })

  describe('when dispatching the action that fails', () => {
    it('should dispatch the error action', async () => {
      await store.dispatch(mockErrorAction())
      const actions = store.getActions()
      expect(actions).toContainEqual(mockErrorAction.error(error))
    })
  })

  describe('when dispatching the action that succeeds', () => {
    it('should dispatch the success action', async () => {
      await store.dispatch(mockSuccessAction())
      const actions = store.getActions()
      expect(actions).toContainEqual(mockSuccessAction.success(success))
    })
  })

  describe('when adding a parseError function', () => {
    const mockStoreWithErrorParsing = configureStore([
      thunkMiddleware(parseError),
    ])({})

    describe('when dispatching the action that fails', () => {
      it('should dispatch the error action with the parsed error', async () => {
        await mockStoreWithErrorParsing.dispatch(mockErrorAction())
        const actions = mockStoreWithErrorParsing.getActions()
        expect(actions).toContainEqual(mockErrorAction.error(parseError(error)))
      })
    })
  })
})
