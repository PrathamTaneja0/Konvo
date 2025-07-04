import {
    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_CREATE_FAILURE,
    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAILURE,
    GET_ALL_POSTS_SUCCESS,
    GET_USERS_POSTS_SUCCESS,
    USER_LIKE_POST_REQUEST,
    USER_LIKE_POST_SUCCESS,
    USER_LIKE_POST_FAILURE,
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    REPOST_REQUEST,
    REPOST_SUCCESS,
    REPOST_FAILURE,
    FIND_POST_BY_ID_REQUEST,
    FIND_POST_BY_ID_SUCCESS,
    FIND_POST_BY_ID_FAILURE,
    REPLY_POST_SUCCESS,
    UPDATE_SINGLE_POST,
    GET_MY_POSTS_REQUEST,
    GET_MY_POSTS_SUCCESS,
    GET_MY_POSTS_FAILURE,
    GET_FOLLOWED_USER_POSTS_REQUEST,
    GET_FOLLOWED_USER_POSTS_SUCCESS,
    GET_FOLLOWED_USER_POSTS_FAILURE,
    GET_PROFILE_POSTS_REQUEST,
    GET_PROFILE_POSTS_SUCCESS,
    GET_PROFILE_POSTS_FAILURE,
    GET_TIMELINE_REQUEST,
    GET_TIMELINE_SUCCESS,
    GET_TIMELINE_FAILURE,
    CLEAR_PROFILE_POSTS
} from "./ActionType";

const initialState = {
    loading: false,
    data: null,
    error: null,
    posts: [],
    post: null,
    profilePosts: [], // Separate state for profile posts
    profilePostsLoading: false,
    profilePostsError: null,
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_CREATE_REQUEST:
        case POST_DELETE_REQUEST:
        case USER_LIKE_POST_REQUEST:
        case LIKE_POST_REQUEST:
        case REPOST_REQUEST:
        case FIND_POST_BY_ID_REQUEST:
        case GET_MY_POSTS_REQUEST:
        case GET_FOLLOWED_USER_POSTS_REQUEST:
        case GET_TIMELINE_REQUEST:
            return { ...state, loading: true, error: null };

        case POST_CREATE_SUCCESS:
            return { ...state, loading: false, error: null, posts:[action.payload,...state.posts], };

            
        case POST_DELETE_SUCCESS:
            return { ...state, loading: false, error: null, posts: state.posts.filter((post) => post.id!==action.payload), };

        case GET_ALL_POSTS_SUCCESS:
        case GET_USERS_POSTS_SUCCESS:
        case GET_MY_POSTS_SUCCESS:
        case GET_FOLLOWED_USER_POSTS_SUCCESS:
        case GET_TIMELINE_SUCCESS:
            return { ...state, loading: false, error: null, posts: action.payload };

        case USER_LIKE_POST_SUCCESS:
            return { ...state, loading: false, error: null, likedPosts: action.payload };

        case LIKE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                posts: state.posts.map((p) =>
                  p.id === action.payload.id ? { ...p, ...action.payload } : p
                ),
                profilePosts: state.profilePosts.map((p) =>
                  p.id === action.payload.id ? { ...p, ...action.payload } : p
                ),
                post: state.post && state.post.id === action.payload.id
                  ? { ...state.post, ...action.payload }
                  : state.post,
            };

        case REPOST_REQUEST:
            return { ...state, loading: true, error: null };
        case REPOST_SUCCESS:
            console.log("[DEBUG] REPOST_SUCCESS Reducer - Payload:", {
                postId: action.payload.id,
                isReposted: action.payload.isReposted,
                totalRePosts: action.payload.totalRePosts
            });
            const updatedPosts = state.posts.map(post => {
                // Update the target post if it's the one being reposted
                if (post.id === action.payload.id) {
                    console.log("[DEBUG] Updating target post:", {
                        postId: post.id,
                        oldIsReposted: post.isReposted,
                        newIsReposted: action.payload.isReposted
                    });
                    return {
                        ...post,
                        ...action.payload,
                        isReposted: action.payload.isReposted
                    };
                }
                // If this post is a repost of the target post, update its repostFor field
                if (post.isRepost && post.repostFor && post.repostFor.id === action.payload.id) {
                    console.log("[DEBUG] Updating repost reference:", {
                        postId: post.id,
                        repostForId: post.repostFor.id,
                        oldIsReposted: post.repostFor.isReposted,
                        newIsReposted: action.payload.isReposted
                    });
                    return {
                        ...post,
                        repostFor: {
                            ...post.repostFor,
                            ...action.payload,
                            isReposted: action.payload.isReposted
                        }
                    };
                }
                return post;
            });
            const updatedProfilePosts = state.profilePosts.map(post => {
                if (post.id === action.payload.id) {
                    return {
                        ...post,
                        ...action.payload,
                        isReposted: action.payload.isReposted
                    };
                }
                if (post.isRepost && post.repostFor && post.repostFor.id === action.payload.id) {
                    return {
                        ...post,
                        repostFor: {
                            ...post.repostFor,
                            ...action.payload,
                            isReposted: action.payload.isReposted
                        }
                    };
                }
                return post;
            });
            console.log("[DEBUG] REPOST_SUCCESS Reducer - State Update:", {
                postsUpdated: updatedPosts.some(p => p.id === action.payload.id),
                repostsUpdated: updatedPosts.some(p => p.isRepost && p.repostFor?.id === action.payload.id)
            });
            return {
                ...state,
                loading: false,
                posts: updatedPosts,
                profilePosts: updatedProfilePosts,
                error: null
            };
        case REPOST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case FIND_POST_BY_ID_SUCCESS:
        case REPLY_POST_SUCCESS:
            return { ...state, loading: false, error: null, post: action.payload };

        case POST_CREATE_FAILURE:
        case POST_DELETE_FAILURE:
        case USER_LIKE_POST_FAILURE:
        case LIKE_POST_FAILURE:
        case FIND_POST_BY_ID_FAILURE:
        case GET_MY_POSTS_FAILURE:
        case GET_FOLLOWED_USER_POSTS_FAILURE:
        case GET_TIMELINE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case UPDATE_SINGLE_POST:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.payload.id) {
                        return { ...post, ...action.payload };
                    }
                    if (post.isRepost && post.repostFor && post.repostFor.id === action.payload.id) {
                        return { ...post, repostFor: { ...post.repostFor, ...action.payload } };
                    }
                    return post;
                })
            };

        case GET_PROFILE_POSTS_REQUEST:
            return { ...state, profilePostsLoading: true, profilePostsError: null };

        case GET_PROFILE_POSTS_SUCCESS:
            return { ...state, profilePostsLoading: false, profilePostsError: null, profilePosts: action.payload };

        case GET_PROFILE_POSTS_FAILURE:
            return { ...state, profilePostsLoading: false, profilePostsError: action.payload };

        case CLEAR_PROFILE_POSTS:
            return { ...state, profilePosts: [], profilePostsLoading: false, profilePostsError: null };

        default:
            return state;
    }
};

export default postReducer;