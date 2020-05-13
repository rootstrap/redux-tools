import configureStore from 'redux-mock-store'

import thunkMiddleware from '../src/thunkMiddleware'
import createThunk from '../src/createThunk'

const parseError = error => error.toString()
const parseResponse = response => response.toUpperCase()
let mockStore = configureStore([thunkMiddleware])

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

  describe('when adding a parsing functions', () => {
    let mockStoreWithParseFunctions
    beforeEach(() => {
      mockStoreWithParseFunctions = configureStore([
        thunkMiddleware.withConfig({ parseError, parseResponse }),
      ])({})
      mockErrorAction = createThunk('error', () => {
        throw error
      })
      mockSuccessAction = createThunk('success', () => {
        return success
      })
    })

    describe('when dispatching the action that fails', () => {
      it('should dispatch the error action with the parsed error', async () => {
        await mockStoreWithParseFunctions.dispatch(mockErrorAction())
        const actions = mockStoreWithParseFunctions.getActions()
        expect(actions).toContainEqual(mockErrorAction.error(parseError(error)))
      })
    })

    describe('when dispatching the action that succeeds', () => {
      it('should dispatch the success action with the parsed data', async () => {
        await mockStoreWithParseFunctions.dispatch(mockSuccessAction())
        const actions = mockStoreWithParseFunctions.getActions()
        expect(actions).toContainEqual(
          mockSuccessAction.success(parseResponse(success)),
        )
      })
    })
  })
})
