import React from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import PostCard from '../HomeSection/PostCard';
import { Divider } from '@mui/material';
import useColorMode from "../../theme/useColorMode";
function PostDetails() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }
    const { theme } = useColorMode();

  return (
    <React.Fragment>
        <section className='bg-white z-50 flex items-center sticky top-0 bg-opacity-95' style={{backgroundColor: theme.palette.background.default}}>
            <KeyboardBackspaceIcon className='cursor-pointer' onClick={handleBack} />
            <h1 className='text-xl font-bold py-5 opacity-90 ml-5'>Post</h1>
        </section>
        <section>
            {/* TODO: Pass the correct post object as prop */}
        </section>
        <section>
            {/* TODO: Render replies or related posts with correct post prop */}
        </section>
    </React.Fragment>
  )
}

export default PostDetails