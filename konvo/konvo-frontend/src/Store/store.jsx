
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux';
import {thunk} from 'redux-thunk';
import {authReducer} from './Auth/Reducer.jsx';
import postReducer from './Post/Reducer.jsx';

// Fix: Remove the nested "reducer" object
export const rootReducer = combineReducers({
    auth: authReducer,
    post: postReducer
    // Add other reducers here directly
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;