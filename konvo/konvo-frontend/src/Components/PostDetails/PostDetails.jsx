import React from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import PostCard from '../HomeSection/PostCard';
import { Divider } from '@mui/material';
import useColorMode from "../../theme/useColorMode";
import { findPostsById } from '../../Store/Post/Action';
function PostDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleBack = () => {
        navigate(-1);
    }
const {id} = useParams()
const {post} = useSelector(store=> store)
    const { theme } = useColorMode();
    useEffect(()=> {
        if(id){
            dispatch(findPostsById(id))
        }
    },[])

  return (
    <React.Fragment>
        <section className='bg-white z-50 flex items-center sticky top-0 bg-opacity-95' style={{backgroundColor: theme.palette.background.default}}>
            <KeyboardBackspaceIcon className='cursor-pointer' onClick={handleBack} />
            <h1 className='text-xl font-bold py-5 opacity-90 ml-5'>Post</h1>
        </section>
        <section>
            <PostCard post = {post.post}/>
            <Divider sx = {{margin: "2rem 0 rem"}}/>
        </section>
        <section>
            {post.post.replyPost.map((item)=> <PostCard item = {post}/>)}
        </section>
    </React.Fragment>
  )
}

export default PostDetails