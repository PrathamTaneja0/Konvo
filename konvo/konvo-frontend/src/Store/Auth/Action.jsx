import axios from 'axios';
import { api } from '../../Components/Config/api.js';
import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_FAILURE,
    LOGOUT_USER,
    FIND_USER_BY_ID_SUCCESS,
    FIND_USER_BY_ID_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    FOLLOW_USER_REQUEST,
    FOLLOW_USER_SUCCESS,
    FOLLOW_USER_FAILURE,
    SET_JWT
} from './ActionType';

export const loginUser = (loginData) => async (dispatch) => {
    try {
        const {data} = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/signin`, loginData);
        console.log("Backend response data:", data);
        if(data.jwt) {
            localStorage.setItem('jwt', data.jwt);
            dispatch({type: LOGIN_USER_SUCCESS, payload: data});
        }
    }
    catch (error) {
        console.log(error);
        let errorMsg = error.message;
        if (error.response && error.response.status === 403) {
            errorMsg = "Invalid username or password";
        }
        dispatch({type: LOGIN_USER_FAILURE, payload: errorMsg});
    }
}

export const registerUser = (registerData) => async (dispatch) => {
    try {
        const backendData = {
            fullName: `${registerData.firstName} ${registerData.lastName}`,
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
            birthDate: registerData.dateOfBirth
        };

        const {data} = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/signup`, backendData);
        console.log("Backend response data:", data);
        

        if(data.jwt) {
            localStorage.setItem('jwt', data.jwt);
            dispatch({type: REGISTER_USER_SUCCESS, payload: data});
        }
    }
    catch (error) {
        console.log("errorAtFrontend");
        console.log(error);
        dispatch({type: REGISTER_USER_FAILURE, payload: error.message});
    }
}

export const getUserProfile = (jwt) => async (dispatch) => {
    try {
        console.log("JWT token being sent:", jwt);
        console.log("API_BASE_URL:", import.meta.env.VITE_API_URL || "http://localhost:8080");
        
        const {data} = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        console.log("User profile response:", data);
        dispatch({type: GET_USER_PROFILE_SUCCESS, payload: data});

    }
    
    catch (error) {
        console.log("Error fetching user profile:", error);
        console.log("Error response:", error.response?.data);
        dispatch({type: GET_USER_PROFILE_FAILURE, payload: error.message});
    }
}

export const findUserById = (userId) => async (dispatch) => {
    try {
        const {data} = await api.get(`/api/users/${userId}`);
        dispatch({type: FIND_USER_BY_ID_SUCCESS, payload: data});
    } catch (error) {
        console.log("Error: ", error);
        dispatch({type: FIND_USER_BY_ID_FAILURE, payload: error.message});
    }
}

export const updateUserProfile = (reqData) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_REQUEST });
    try {
        const { data } = await api.put(`/api/users/update`, reqData);
        console.log("updated user", data);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    } catch (error) {
        console.log("error", error);
        dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
    }
}

export const followUserAction = (userId) => async (dispatch) => {
    try {
        const { data } = await api.put(`/api/users/${userId}/follow`);
        console.log("followed user", data);
        dispatch({ type: FOLLOW_USER_SUCCESS, payload: data });
    } catch (error) {
        console.log("error", error);
        dispatch({ type: FOLLOW_USER_FAILURE, payload: error.message });
    }
}

export const logout = () => async (dispatch) => {
    localStorage.removeItem('jwt');
    dispatch({type: LOGOUT_USER, payload: null});
}

export const setJwt = (jwt) => (dispatch) => {
    dispatch({ type: SET_JWT, payload: jwt });
};
