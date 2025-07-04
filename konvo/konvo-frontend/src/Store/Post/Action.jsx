import {api} from "../../Components/Config/api";
import { 
    GET_ALL_POSTS_REQUEST, 
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
    GET_ALL_POSTS_SUCCESS,
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
    CLEAR_PROFILE_POSTS
} from "./ActionType";

// Fetch all posts
export const getAllPosts = () => async (dispatch) => {
    try {
        const {data} = await api.get(`/api/posts`);
        console.log("Get All Posts Data:", data);
        dispatch({type: GET_ALL_POSTS_SUCCESS, payload: data});
    } catch(error) {
        console.log("Error in Get All Posts:", error);
        dispatch({type: GET_ALL_POSTS_FAILURE, payload: error.response.data.message});
    }
}

// Fetch user posts (if you want to use userId, update the API endpoint accordingly)
export const getUsersPosts = (userId) => async (dispatch) => {
    try {
        // If you want to fetch posts for a specific user, use the correct endpoint:
        // const {data} = await api.get(`/api/posts/user/${userId}`);
        const {data} = await api.get(`/api/posts/user/${userId}`);
        console.log("Get User's Posts Data:", data);
        dispatch({type: GET_USERS_POSTS_SUCCESS, payload: data});
    } catch(error) {
        console.log("Error in Get User's Posts:", error);
        dispatch({type: GET_USERS_POSTS_FAILURE, payload: error.response.data.message});
    }
}

// For getting posts liked by a user
export const findPostsByLikeContainUser = (userId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/user/${userId}/likes`);
        console.log("user like posts : ", data);
        dispatch({ type: USER_LIKE_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log("catch error - ", error);
        dispatch({ type: USER_LIKE_POST_FAILURE, payload: error.message });
    }
}

export const findPostsById = (postId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/${postId}`);
        console.log("find post by id : ", data);
        dispatch({ type: FIND_POST_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        console.log("catch error - ", error);
        dispatch({ type: FIND_POST_BY_ID_FAILURE, payload: error.message });
    }
}

// For creating a post
export const createPost = (postData) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/posts/create`, postData);
        console.log("created post: ", data);
        dispatch({ type: POST_CREATE_SUCCESS, payload: data });
    } catch (error) {
        console.log("catch error - ", error);
        dispatch({ type: POST_CREATE_FAILURE, payload: error.message });
    }
}

export const createPostReply = (postData) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/posts/reply`, postData);
        console.log("created post reply: ", data);
        dispatch({ type: REPLY_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log("catch error - ", error);
        dispatch({ type: REPLY_POST_FAILURE, payload: error.message });
    }
}

export const updateSinglePost = (postId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/${postId}`);
        dispatch({ type: UPDATE_SINGLE_POST, payload: data });
    } catch (error) {
        console.error("Error updating single post:", error);
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

    // Prevent self-like on client side
    if (post && post.user?.id === currentUserId) {
        dispatch({
            type: LIKE_POST_FAILURE,
            payload: "You cannot like your own post.",
        });
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
}

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
}

export const deletePost = (postId, originalPostIdIfRepost) => async (dispatch) => {
    try {
        await api.delete(`/api/posts/${postId}`);
        dispatch({ type: POST_DELETE_SUCCESS, payload: postId });
        if (originalPostIdIfRepost) {
            dispatch(updateSinglePost(originalPostIdIfRepost));
        }
        dispatch(getAllPosts());
    } catch (error) {
        dispatch({ type: POST_DELETE_FAILURE, payload: error.message });
    }
}

export const deleteRePost = (postId) => async (dispatch) => {
    dispatch({ type: REPOST_REQUEST });
    try {
        console.log("Deleting repost for postId:", postId);
        const { data } = await api.delete(`/api/posts/${postId}/repost`);
        console.log("Delete repost API response:", data);
        dispatch({ type: REPOST_SUCCESS, payload: data });
        dispatch(updateSinglePost(postId));
        dispatch(getAllPosts());
    } catch (error) {
        console.log("Delete repost error:", error);
        dispatch({ type: REPOST_FAILURE, payload: error.message });
    }
}

// F-V1: Get user's own posts (20 most recent)
export const getMyPosts = () => async (dispatch) => {
    dispatch({ type: GET_MY_POSTS_REQUEST });
    try {
        const { data } = await api.get(`/api/posts/my-posts`);
        console.log("Get My Posts Data:", data);
        dispatch({ type: GET_MY_POSTS_SUCCESS, payload: data });
    } catch (error) {
        console.log("Error in Get My Posts:", error);
        dispatch({ type: GET_MY_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
    }
}

// Get user's own authored posts (excluding reposts) - for profile
export const getMyAuthoredPosts = () => async (dispatch) => {
    dispatch({ type: GET_PROFILE_POSTS_REQUEST });
    try {
        const { data } = await api.get(`/api/posts/my-authored-posts`);
        dispatch({ type: GET_PROFILE_POSTS_SUCCESS, payload: data });
    } catch (error) {
        console.log("Error in Get My Authored Posts:", error);
        dispatch({ type: GET_PROFILE_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
    }
}

// F-V2: Get specific followed user's posts (20 most recent)
export const getFollowedUserPosts = (userId) => async (dispatch) => {
    dispatch({ type: GET_FOLLOWED_USER_POSTS_REQUEST });
    try {
        const { data } = await api.get(`/api/posts/user/${userId}/posts`);
        console.log("Get Followed User Posts Data:", data);
        dispatch({ type: GET_FOLLOWED_USER_POSTS_SUCCESS, payload: data });
    } catch (error) {
        console.log("Error in Get Followed User Posts:", error);
        dispatch({ type: GET_FOLLOWED_USER_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
    }
}

// Get any user's posts (for profile viewing) - more permissive than F-V2
export const getUserProfilePosts = (userId) => async (dispatch) => {
    dispatch({ type: GET_PROFILE_POSTS_REQUEST });
    try {
        const { data } = await api.get(`/api/posts/user/${userId}/profile-posts`);
        dispatch({ type: GET_PROFILE_POSTS_SUCCESS, payload: data });
    } catch (error) {
        console.log("Error in Get User Profile Posts:", error);
        dispatch({ type: GET_PROFILE_POSTS_FAILURE, payload: error.response?.data?.message || error.message });
    }
}

// F-V3: Get aggregated timeline of all followed users' posts (20 most recent)
export const getTimeline = () => async (dispatch) => {
    dispatch({ type: GET_TIMELINE_REQUEST });
    try {
        const { data } = await api.get(`/api/posts/timeline`);
        console.log("Get Timeline Data:", data);
        dispatch({ type: GET_TIMELINE_SUCCESS, payload: data });
    } catch (error) {
        console.log("Error in Get Timeline:", error);
        dispatch({ type: GET_TIMELINE_FAILURE, payload: error.response?.data?.message || error.message });
    }
}

export const clearProfilePosts = () => (dispatch) => {
    dispatch({ type: CLEAR_PROFILE_POSTS });
};

