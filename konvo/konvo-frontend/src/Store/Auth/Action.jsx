
import { API_BASE_URL } from '../../Components/Config/api.js';
import axios from 'axios';

export const loginUser = (loginData) => async (dispatch) => {
    try {
        const {data} = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
        console.log("login data:", data);
        if(data.jwt) {
            localStorage.setItem('jwt', data.jwt);
            dispatch({type: 'LOGIN_USER_SUCCESS', payload: data});
        }
    }
    catch (error) {
        console.log(error);
        dispatch({type: 'LOGIN_USER_FAILURE', payload: error.message});
    }
}

export const registerUser = (registerData) => async (dispatch) => {
    try {
        const {data} = await axios.post(`${API_BASE_URL}/auth/signup`, registerData);
        console.log("signin data:", data);

        if(data.jwt) {
            localStorage.setItem('jwt', data.jwt);
            dispatch({type: 'REGISTER_USER_SUCCESS', payload: data});
        }
    }
    catch (error) {
        console.log(error);
        dispatch({type: 'REGISTER_USER_FAILURE', payload: error.message});
    }
}

export const getUserProfile = (jwt) => async (dispatch) => {
    try {
        const {data} = await axios.get(`${API_BASE_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        dispatch({type: 'GET_USER_PROFILE_SUCCESS', payload: data});

    }
    catch (error) {
        console.log(error);
        dispatch({type: 'GET_USER_PROFILE_FAILURE', payload: error.message});
    }
}

export const logout = () => async (dispatch) => {
    localStorage.removeItem('jwt');
    dispatch({type: 'LOGOUT', payload: null});

}
