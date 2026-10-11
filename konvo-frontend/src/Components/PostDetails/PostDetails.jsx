import React, { useEffect } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import PostCard from '../HomeSection/PostCard';
import { Divider } from '@mui/material';
import useColorMode from "../../theme/useColorMode";
import { findPostsById } from '../../Store/Post/Action';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReplyCard from '../HomeSection/ReplyCard';

function PostDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleBack = () => {
        navigate(-1);
    }
    const { id } = useParams();
    const post = useSelector(store => store.post);
    const { theme } = useColorMode();

    useEffect(() => {
        if (id) {
            dispatch(findPostsById(id));
        }
    }, []);

    const handleReplyDeleted = () => {
        if (id) {
            dispatch(findPostsById(id));
        }
        dispatch({ type: 'GET_ALL_POSTS_REQUEST' }); // triggers HomeSection to refresh
        dispatch({ type: 'GET_ALL_POSTS_SUCCESS', payload: [] }); // force update (will be replaced by real data)
        dispatch({ type: 'GET_ALL_POSTS_FAILURE', payload: null }); // clear errors
        dispatch({ type: 'GET_ALL_POSTS_REQUEST' }); // re-fetch
    };

    return (
        <React.Fragment>
            <section className='bg-white z-50 flex items-center sticky top-0 bg-opacity-95' style={{ backgroundColor: theme.palette.background.default }}>
                <KeyboardBackspaceIcon className='cursor-pointer' onClick={handleBack} />
                <h1 className='text-xl font-bold py-5 opacity-90 ml-5'>Post</h1>
            </section>
            <section>
                {post.post ? <PostCard post={post.post} /> : <div>Loading...</div>}
                <Divider sx={{ margin: "2rem 0 rem" }} />
            </section>
            <section>
                {post.post && post.post.replyPosts && post.post.replyPosts.length > 0 ? (
                    post.post.replyPosts.map((item) => <ReplyCard post={item} key={item.id} onReplyDeleted={handleReplyDeleted} />)
                ) : post.post ? (
                    <div>No replies yet.</div>
                ) : null}
            </section>
        </React.Fragment>
    );
}

export default PostDetails

// Prompt: "How do I implement real-time updates for post details when replies are added?"
// Prompt: "The post details page is not refreshing after a reply is deleted. How can I fix this?"