import React from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import PostCard from '../HomeSection/PostCard';
import { Divider } from '@mui/material';
function PostDetails() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }

  return (
    <React.Fragment>
        <section className='bg-white z-50 flex items-center sticky top-0 bg-opacity-95'>
            <KeyboardBackspaceIcon className='cursor-pointer' onClick={handleBack} />
            <h1 className='text-xl font-bold py-5 opacity-90 ml-5'>Post</h1>
        </section>
        <section>
            <PostCard />
            <Divider sx={{ margin: "2rem 0rem" }} />
        </section>
        <section>
            {[1,1,1,1].map((item, index) => (
                <PostCard key={index} />
            ))}
        </section>

    </React.Fragment>
  )
}

export default PostDetails