import { api } from '../../Components/Config/api';
import {
  GET_ALL_POSTS_REQUEST,
  GET_ALL_POSTS_SUCCESS,
  GET_ALL_POSTS_FAILURE,
  GET_USERS_POSTS_SUCCESS,
  GET_USERS_POSTS_FAILURE,
  USER_LIKE_POST_SUCCESS,
  USER_LIKE_POST_FAILURE,
  FIND_POST_BY_ID_SUCCESS,
  FIND_POST_BY_ID_FAILURE,
  POST_CREATE_SUCCESS,
  POST_CREATE_FAILURE,
  REPLY_POST_SUCCESS,
  REPLY_POST_FAILURE,
  REPOST_REQUEST,
  REPOST_SUCCESS,
  REPOST_FAILURE,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILURE,
  UPDATE_SINGLE_POST,
  GET_MY_POSTS_REQUEST,
  GET_MY_POSTS_FAILURE,
  GET_MY_POSTS_SUCCESS,
  GET_FOLLOWED_USER_POSTS_REQUEST,
  GET_FOLLOWED_USER_POSTS_FAILURE,
  GET_FOLLOWED_USER_POSTS_SUCCESS,
  GET_PROFILE_POSTS_REQUEST,
  GET_PROFILE_POSTS_SUCCESS,
  GET_PROFILE_POSTS_FAILURE,
  GET_TIMELINE_REQUEST,
  GET_TIMELINE_FAILURE,
  GET_TIMELINE_SUCCESS,
  CLEAR_PROFILE_POSTS,
} from './ActionType';

export const getAllPosts = () => async (dispatch) => {
  try {
    const { data } = await api.get('/api/posts');
    dispatch({ type: GET_ALL_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const getUsersPosts = (userId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/api/posts/user/${userId}`);
    dispatch({ type: GET_USERS_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USERS_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const findPostsByLikeContainUser = (userId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/api/posts/user/${userId}/likes`);
    dispatch({ type: USER_LIKE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_LIKE_POST_FAILURE, payload: error.message });
  }
};

export const findPostsById = (postId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/api/posts/${postId}`);
    dispatch({ type: FIND_POST_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_POST_BY_ID_FAILURE, payload: error.message });
  }
};

export const createPost = (postData) => async (dispatch) => {
  try {
    const { data } = await api.post('/api/posts/create', postData);
    dispatch({ type: POST_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: POST_CREATE_FAILURE, payload: error.message });
  }
};

export const createPostReply = (postData) => async (dispatch) => {
  try {
    const { data } = await api.post('/api/posts/reply', postData);
    dispatch({ type: REPLY_POST_SUCCESS, payload: data });
    dispatch(getAllPosts());
    if (postData.userId) {
      dispatch(getUserProfilePosts(postData.userId));
    }
  } catch (error) {
    dispatch({ type: REPLY_POST_FAILURE, payload: error.message });
  }
};

export const updateSinglePost = (postId) => async (dispatch) => {
  try {
    const { data } = await api.get(`/api/posts/${postId}`);
    dispatch({ type: UPDATE_SINGLE_POST, payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const repostPost = (postId, isProfile, userId) => async (dispatch) => {
  dispatch({ type: REPOST_REQUEST });
  try {
    const { data } = await api.put(`/api/posts/${postId}/repost`);
    dispatch({ type: REPOST_SUCCESS, payload: data });
    dispatch(updateSinglePost(postId));
    dispatch(getAllPosts());
    if (isProfile) {
      if (userId) {
        dispatch(getUserProfilePosts(userId));
      } else {
        dispatch(getMyAuthoredPosts());
      }
    }
  } catch (error) {
    dispatch({ type: REPOST_FAILURE, payload: error.message });
  }
};

export const undoRepost = (postId, isProfile, userId) => async (dispatch) => {
  dispatch({ type: REPOST_REQUEST });
  try {
    const { data } = await api.delete(`/api/posts/${postId}/repost`);
    dispatch({ type: REPOST_SUCCESS, payload: data });
    dispatch(updateSinglePost(postId));
    dispatch(getAllPosts());
    if (isProfile) {
      if (userId) {
        dispatch(getUserProfilePosts(userId));
      } else {
        dispatch(getMyAuthoredPosts());
      }
    }
  } catch (error) {
    dispatch({ type: REPOST_FAILURE, payload: error.message });
  }
};

export const likePost = (postId, isProfile, userId) => async (dispatch, getState) => {
  const state = getState();
  const posts = state.post.posts || [];
  const post = posts.find((p) => p.id === postId);
  const currentUserId = state.auth.user?.id;
  if (post && post.user?.id === currentUserId) {
    dispatch({ type: LIKE_POST_FAILURE, payload: 'You cannot like your own post.' });
    return;
  }
  try {
    const { data } = await api.post(`/api/posts/${postId}/like`);
    dispatch({ type: LIKE_POST_SUCCESS, payload: data });
    if (isProfile) {
      if (userId) {
        dispatch(getUserProfilePosts(userId));
      } else {
        dispatch(getMyAuthoredPosts());
      }
    }
  } catch (error) {
    dispatch({ type: LIKE_POST_FAILURE, payload: error.response?.data || error.message });
  }
};

export const dislikePost = (postId, isProfile, userId) => async (dispatch) => {
  try {
    await api.delete(`/api/posts/${postId}/like`);
    const { data } = await api.get(`/api/posts/${postId}`);
    dispatch({ type: LIKE_POST_SUCCESS, payload: data });
    if (isProfile) {
      if (userId) {
        dispatch(getUserProfilePosts(userId));
      } else {
        dispatch(getMyAuthoredPosts());
      }
    }
  } catch (error) {
    dispatch({ type: LIKE_POST_FAILURE, payload: error.message });
  }
};

export const deletePost = (postId, originalPostIdIfRepost, isProfile, userId) => async (dispatch) => {
  try {
    await api.delete(`/api/posts/${postId}`);
    dispatch({ type: POST_DELETE_SUCCESS, payload: postId });
    if (originalPostIdIfRepost) {
      dispatch(updateSinglePost(originalPostIdIfRepost));
    }
    dispatch(getAllPosts());
    if (isProfile) {
      if (userId) {
        dispatch(getUserProfilePosts(userId));
      } else {
        dispatch(getMyAuthoredPosts());
      }
    }
  } catch (error) {
    dispatch({ type: POST_DELETE_FAILURE, payload: error.message });
  }
};

export const deleteRePost = (postId) => async (dispatch) => {
  dispatch({ type: REPOST_REQUEST });
  try {
    const { data } = await api.delete(`/api/posts/${postId}/repost`);
    dispatch({ type: REPOST_SUCCESS, payload: data });
    dispatch(updateSinglePost(postId));
    dispatch(getAllPosts());
  } catch (error) {
    dispatch({ type: REPOST_FAILURE, payload: error.message });
  }
};

export const getMyPosts = () => async (dispatch) => {
  dispatch({ type: GET_MY_POSTS_REQUEST });
  try {
    const { data } = await api.get('/api/posts/my-posts');
    dispatch({ type: GET_MY_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_MY_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const getMyAuthoredPosts = () => async (dispatch) => {
  dispatch({ type: GET_PROFILE_POSTS_REQUEST });
  try {
    const { data } = await api.get('/api/posts/my-authored-posts');
    dispatch({ type: GET_PROFILE_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_PROFILE_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const getFollowedUserPosts = (userId) => async (dispatch) => {
  dispatch({ type: GET_FOLLOWED_USER_POSTS_REQUEST });
  try {
    const { data } = await api.get(`/api/posts/followed/${userId}`);
    dispatch({ type: GET_FOLLOWED_USER_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_FOLLOWED_USER_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const getUserProfilePosts = (userId) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_POSTS_REQUEST });
  try {
    const { data } = await api.get(`/api/posts/user/${userId}/profile`);
    dispatch({ type: GET_PROFILE_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_PROFILE_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const getTimeline = () => async (dispatch) => {
  dispatch({ type: GET_TIMELINE_REQUEST });
  try {
    const { data } = await api.get('/api/posts/timeline');
    dispatch({ type: GET_TIMELINE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_TIMELINE_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

export const clearProfilePosts = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_POSTS });
};

