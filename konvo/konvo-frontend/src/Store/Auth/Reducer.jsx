import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    GET_USER_PROFILE_REQUEST,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_FAILURE,
    LOGOUT_USER,
    FIND_USER_BY_ID_SUCCESS,
    FOLLOW_USER_SUCCESS,
    UPDATE_USER_SUCCESS
} from './ActionType';

const initialState = {
    user: null,
    loading:false,
    error: null,
    jwt:null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                jwt: action.payload.jwt,
                loading: false,
                error: null
            };
        case LOGIN_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                jwt: action.payload.jwt,
                loading: false,
                error: null
            };
        case REGISTER_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GET_USER_PROFILE_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
                updateUser:true
            };
        case FIND_USER_BY_ID_SUCCESS:
            return {
                ...state,
                findUser: action.payload,
                loading: false,
                error: null
            };
        case FOLLOW_USER_SUCCESS:
            return {
                ...state,
                findUser: action.payload,
                loading: false,
                error: null
            };
        case GET_USER_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case LOGIN_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case REGISTER_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_USER_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case LOGOUT_USER:
            return {
                ...initialState
            };
        default:
            console.log("why is it null"+ initialState);
            return state;
    }
}