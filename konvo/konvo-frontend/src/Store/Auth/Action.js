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
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  SET_JWT,
} from './ActionType.js';
import { getTimeline } from '../Post/Action.js';

export const loginUser = (loginData) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/auth/signin`,
      loginData
    );
    if (data.jwt) {
      localStorage.setItem('jwt', data.jwt);
      dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
    }
  } catch (error) {
    let errorMsg = error.message;
    if (error.response && error.response.status === 403) {
      errorMsg = 'Invalid username or password';
    }
    dispatch({ type: LOGIN_USER_FAILURE, payload: errorMsg });
  }
};

export const registerUser = (registerData) => async (dispatch) => {
  try {
    const backendData = {
      fullName: `${registerData.firstName} ${registerData.lastName}`,
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      birthDate: registerData.dateOfBirth,
    };
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/auth/signup`,
      backendData
    );
    if (data.jwt) {
      localStorage.setItem('jwt', data.jwt);
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: REGISTER_USER_FAILURE, payload: error.message });
  }
};

export const getUserProfile = (jwt) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users/profile`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USER_PROFILE_FAILURE, payload: error.message });
  }
};

export const findUserById = (userId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/api/users/${userId}`);
    dispatch({ type: FIND_USER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_USER_BY_ID_FAILURE, payload: error.message });
  }
};

export const updateUserProfile = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { data } = await api.put(`/api/users/update`, reqData);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
  }
};

export const followUserAction = (userId) => async (dispatch, getState) => {
  try {
    const { data } = await api.put(`/api/users/${userId}/follow`);
    dispatch({ type: FOLLOW_USER_SUCCESS, payload: data });
    const jwt = getState().auth.jwt;
    if (jwt) {
      dispatch(getUserProfile(jwt));
    }
    dispatch(getTimeline());
  } catch (error) {
    dispatch({ type: FOLLOW_USER_FAILURE, payload: error.message });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('jwt');
  dispatch({ type: LOGOUT_USER });
};

export const setJwt = (jwt) => (dispatch) => {
  dispatch({ type: SET_JWT, payload: jwt });
};
