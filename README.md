# @rootstrap/redux-tools
This package has some basic functionality common to both react bases.
It includes a status reducer that lets you track the status of your async actions and a thunks-like middleware that will automatically dispatch success and failure actions.

## Basic usage

### ActionCreators

This package provides an action creator utility, that together with the provided middleware will make it very easy to create side effects for your actions.
This setup will automatically execute your side effect thunk and dispatch success or error actions when the thunk succeeds or fails, respectively.

`createThunk` receives the action names prefix as the first argument and the async thunk as the second one.

Example:
```js
// src/actions/userActions.js
import { createThunk } from '@rootstrap/redux-tools'

export const getProfile = createThunk(
  'GET_PROFILE',
  userService.getProfile,
);
```

You can then dispatch this `getProfile` action, and the middleware will automatically dispatch actions with types `GET_PROFILE_SUCCESS` or `GET_PROFILE_ERROR` for you.

The returned object, (`getProfile` in the example above) has 4 properties you can use in order to handle the different dispatched actions in your reducer:
- request
- success
- error
- reset

Following the previous example:

```js
// src/reducers/userReducer.js

import { getProfile } from 'src/actions/userActions';

const actionHandlers = {
  [getProfile.success]: (state, { payload }) => {
    state.user = payload;
  },
};
```

If you need to access the store, or dispatch extra actions from your thunk, you can use `dispatch` and `getState` as the last two parameters.

Example:

Dispatching some custom analytics event that requires store data:
```js
// src/actions/userActions.js
import { createThunk } from '@rootstrap/redux-tools'

export const getProfile = createThunk(
  'GET_PROFILE',
  async (userId, dispatch, getState) => {
    const { analytics: { analyticsToken } } = getState();
    const profile = await userService.getProfile(profileId);
    dispatch(analytics.logProfile(analyticsToken, profile));
    return profile;
  },
);
```

### Status tracking

To access status information on a component the `useStatus` hook is provided.
The following status constants are exported:
- LOADING
- SUCCESS
- ERROR

Here is a simple example:

```js
import { useStatus, useDispatch } from 'hooks';
import { getProfile } from 'src/actions/userActions';
import { SUCCESS, LOADING, ERROR } from '@rootstrap/redux-tools'

const MyComponent = () => {
  const getProfileRequest = useDispatch(getProfile);
  const { status, error } = useStatus(getProfile);

  return <>
    <button onClick={getProfileRequest}>Show profile!</button>
    {(status === LOADING) && <Loading />}
    {(status === SUCCESS) && <ProfileComponent />}
    {(status === ERROR) && <ErrorComponent />}
  </>
}
```

A `useLoading` hook is also available if you only care about loading status. It returns a boolean indicating whether the action is still loading or not.

To reset the status of an action you can dispatch the `reset` action returned by `createThunk`.


## Installation guide

### Step 1: install the package

`npm i @rootstrap/redux-tools`
or
`yarn add @rootstrap/redux-tools`

### Step 2: configure the reducer
```js
// src/reducers/index.js
import { combineReducers } from 'redux'
import { statusReducer } from '@rootstrap/redux-tools'

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass statusReducer under 'statusReducer' key,
  statusReducer
})
```

### Step 3: configure the middleware
```js
import { createStore, applyMiddleware } from 'redux'
import { thunkMiddleware } from '@rootstrap/redux-tools'

import rootReducer from 'src/reducers/index'

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware()))
```

`thunkMiddleware` accepts a function as an optional parameter. This function will be used to transform the error before dispatching it.
