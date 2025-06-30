import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import userIcon from '../../assets/userIcon.png';
import verify from '../../assets/verify.png';
import TeamIgris from '../../assets/TeamIgris.png';
import user1 from '../../assets/user1.webp';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import { createPostReply, getAllPosts } from '../../Store/Post/Action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  borderRadius: 4,
};

export default function ReplyModal({ open, onClose, post }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    const replyData = {
      content: values.content,
      postId: post?.id,
    };
    dispatch(createPostReply(replyData)).then(() => {
      dispatch(getAllPosts());
      onClose();
    });
  };

  const formik = useFormik({
    initialValues: {
      content: '',
      image: "",
      postId: post.id,
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Content is required'),
    }),
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
      handleSubmit(values);
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="flex justify-between items-start">
          <div className="flex space-x-2 items-center">
            <Avatar
              onClick={() => navigate(`/profile/${post?.user?.id}`)}
              className="cursor-pointer"
              alt={post?.user?.username || "username"}
              src={post?.user?.image || userIcon}
            />
            <span className="font-semibold">{post?.user?.fullName}</span>
            <span className="text-gray-600">@{post?.user?.username}</span>
            <img className="w-4 h-4 ml-2" src={verify} alt="verified" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">
              {post?.createdAt ? formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true }) : ''}
            </span>
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="mt-2">
          <div className="cursor-pointer" onClick={() => navigate(`/post/${post?.id}`)}>
            <p className="mb-2 p-0">{post?.content}</p>
          </div>
        </div>
        <section className="py-2">
          <div className="flex space-x-5">
            <Avatar alt="username" src={user1} />
            <div className="w-full">
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <input
                    type="text"
                    name="content"
                    placeholder="What's happening?"
                    className="border-none outline-none text-xl bg-transparent w-full h-10"
                    {...formik.getFieldProps("content")}
                  />
                  {formik.touched.content && formik.errors.content && (
                    <div className="text-red-500">{formik.errors.content}</div>
                  )}
                </div>
                <div className="flex justify-end mt-5">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "29px",
                      px: 4
                    }}
                  >
                    Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </Box>
    </Modal>
  );
}
