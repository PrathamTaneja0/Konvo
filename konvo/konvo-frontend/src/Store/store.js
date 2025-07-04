
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { authReducer } from './Auth/Reducer.js';
import postReducer from './Post/Reducer.js';

// Combine all reducers for the Redux store
const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;