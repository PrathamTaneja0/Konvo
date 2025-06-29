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
    REPLY_POST_SUCCESS
} from "./ActionType";

const initialState = {
    loading: false,
    data: null,
    error: null,
    posts: [],
    post: null,
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_CREATE_REQUEST:
        case POST_DELETE_REQUEST:
        case USER_LIKE_POST_REQUEST:
        case LIKE_POST_REQUEST:
        case REPOST_REQUEST:
        case FIND_POST_BY_ID_REQUEST:
            return { ...state, loading: true, error: null };

        case POST_CREATE_SUCCESS:
            return { ...state, loading: false, error: null, posts:[action.payload,...state.posts], };

            
        case POST_DELETE_SUCCESS:
            return { ...state, loading: false, error: null, posts: state.posts.filter((post) => post.id!==action.payload), };

        case GET_ALL_POSTS_SUCCESS:
        case GET_USERS_POSTS_SUCCESS:
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
                post: state.post && state.post.id === action.payload.id
                  ? { ...state.post, ...action.payload }
                  : state.post,
            };

        case REPOST_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                posts: state.posts.map((p) =>
                  p.id === action.payload.id ? { ...p, ...action.payload } : p
                ),
            };

        case FIND_POST_BY_ID_SUCCESS:
        case REPLY_POST_SUCCESS:
            return { ...state, loading: false, error: null, post: action.payload };

        case POST_CREATE_FAILURE:
        case POST_DELETE_FAILURE:
        case USER_LIKE_POST_FAILURE:
        case LIKE_POST_FAILURE:
        case REPOST_FAILURE:
        case FIND_POST_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default postReducer;