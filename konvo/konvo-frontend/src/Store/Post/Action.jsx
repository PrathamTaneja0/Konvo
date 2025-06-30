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
    UPDATE_SINGLE_POST
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

export const repostPost = (postId) => async (dispatch) => {
    dispatch({ type: REPOST_REQUEST });
    try {
        const { data } = await api.put(`/api/posts/${postId}/repost`);
        console.log("[DEBUG] Repost API Response:", {
            postId,
            isReposted: data.isReposted,
            totalRePosts: data.totalRePosts,
            fullData: data
        });
        dispatch({ type: REPOST_SUCCESS, payload: data });
        dispatch(updateSinglePost(postId));
        dispatch(getAllPosts());
    } catch (error) {
        console.log("Repost error:", error);
        dispatch({ type: REPOST_FAILURE, payload: error.message });
    }
};

export const undoRepost = (postId) => async (dispatch) => {
    dispatch({ type: REPOST_REQUEST });
    try {
        const { data } = await api.delete(`/api/posts/${postId}/repost`);
        console.log("[DEBUG] Undo Repost API Response:", {
            postId,
            isReposted: data.isReposted,
            totalRePosts: data.totalRePosts,
            fullData: data
        });
        dispatch({ type: REPOST_SUCCESS, payload: data });
        dispatch(updateSinglePost(postId));
        dispatch(getAllPosts());
    } catch (error) {
        console.log("Undo repost error:", error);
        dispatch({ type: REPOST_FAILURE, payload: error.message });
    }
};

export const likePost = (postId) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/posts/${postId}/like`);
        console.log("liked post: ", data);
        dispatch({ type: LIKE_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log("catch error - ", error);
        dispatch({ type: LIKE_POST_FAILURE, payload: error.message });
    }
}

export const dislikePost = (postId) => async (dispatch) => {
    try {
        await api.delete(`/api/posts/${postId}/like`);
        // Refetch the post to get updated like count and isLiked status
        const { data } = await api.get(`/api/posts/${postId}`);
        dispatch({ type: LIKE_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log("catch error - ", error);
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

