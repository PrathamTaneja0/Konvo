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
import ImageIcon from '@mui/icons-material/Image';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import userIcon from '../../assets/userIcon.png';
import verify from '../../assets/verify.png';
import TeamIgris from '../../assets/TeamIgris.png';
import user1 from '../../assets/user1.webp';

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

function ReplyModal({ open, onClose }) {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState("");

  const handleSubmit = (values) => {
    console.log("handle submit", values);
  };

  const formik = useFormik({
    initialValues: {
      content: '',
      image: "",
      postId: 4,
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

  const handleSelectImage = (event) => {
    setUploadedImage(true);
    const imgFile = event.target.files[0];
    formik.setFieldValue("image", imgFile);
    setImagePreviewUrl(imgFile);
    setUploadedImage(false);
  };

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
              onClick={() => navigate(`/profile/6`)}
              className="cursor-pointer"
              alt="username"
              src={userIcon}
            />
            <span className="font-semibold">Snax Dark</span>
            <span className="text-gray-600">@Snax123 . 2m</span>
            <img className="w-4 h-4 ml-2" src={verify} alt="verified" />
          </div>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="mt-2">
          <div className="cursor-pointer" onClick={() => navigate(`/tweet/1`)}>
            <p className="mb-2 p-0">Brain Rot code </p>
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
                <div className="mt-5">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-5 items-center">
                      <label className="flex items-center space-x-2 cursor-pointer rounded-md">
                        <ImageIcon />
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleSelectImage}
                          className="hidden"
                        />
                      </label>
                      <FmdGoodIcon />
                      <TagFacesIcon />
                    </div>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        borderRadius: "29px",
                        paddingX: "20px",
                        bgcolor: "#1da1f2",
                        "&:hover": {
                          bgcolor: "#1a91da",
                        },
                      }}
                      disabled={uploadedImage}
                    >
                      {uploadedImage ? "Uploading..." : "Post"}
                    </Button>
                  </div>
                  {uploadedImage && (
                    <div className="mt-4 text-blue-500 font-semibold">Uploading image...</div>
                  )}
                  {imagePreviewUrl && (
                    <div className="mt-4">
                      <img
                        src={URL.createObjectURL(imagePreviewUrl)}
                        alt="Preview"
                        className="max-w-full rounded-2xl border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </Box>
    </Modal>
  );
}

export default ReplyModal;