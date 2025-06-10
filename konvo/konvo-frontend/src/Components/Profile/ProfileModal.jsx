import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import moon from "../../assets/moon.jpg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 0,
  outline: "none",
  borderRadius: 4,
  overflow: "hidden"
};

export default function ProfileModal({ open, onClose, initialValues, onSave }) {
  const [uploadedImage, setUploadedImage] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(initialValues?.backgroundImage || moon);
  const [avatarPreview, setAvatarPreview] = useState(initialValues?.profilePicture || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values) => {
    setSaving(true);
    // Prepare data for backend
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('bio', values.bio);
    formData.append('website', values.website);
    formData.append('location', values.location);
    if (values.backgroundImage instanceof File) {
      formData.append('backgroundImage', values.backgroundImage);
    }
    if (values.profilePicture instanceof File) {
      formData.append('profilePicture', values.profilePicture);
    }
    // TODO: Call your backend API here, e.g.:
    // await fetch('/api/profile', { method: 'POST', body: formData });
    // Optionally handle errors and show feedback
    setSaving(false);
    if (onSave) onSave(values);
    if (onClose) onClose();
  };

  const formik = useFormik({
    initialValues: initialValues || {
      fullName: "",
      website: "",
      location: "",
      bio: "",
      backgroundImage: "",
      profilePicture: "",
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  React.useEffect(() => {
    if (open) {
      formik.resetForm({ values: initialValues });
      setBannerPreview(initialValues?.backgroundImage || moon);
      setAvatarPreview(initialValues?.profilePicture || "");
    }
    // eslint-disable-next-line
  }, [open, initialValues]);

  const handleBannerChange = (event) => {
    setUploadedImage(true);
    const file = event.target.files[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
      formik.setFieldValue("backgroundImage", file);
    }
    setUploadedImage(false);
  };

  const handleAvatarChange = (event) => {
    setUploadedImage(true);
    const file = event.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      formik.setFieldValue("profilePicture", file);
    }
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
        <form onSubmit={formik.handleSubmit}>
          {/* Sticky Header with close and save */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 sticky top-0 z-10 bg-white">
            <div className="flex items-center">
              <IconButton onClick={onClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="subtitle1" className="ml-2">Edit Profile</Typography>
            </div>
            <Button type="submit" sx={{ color: '#1da1f2', fontWeight: 600 }} disabled={uploadedImage || saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto max-h-[80vh]">
            {/* Banner and Avatar */}
            <div className="relative w-full h-[180px] bg-gray-200">
              <img
                src={bannerPreview}
                alt="Banner"
                className="w-full h-[180px] object-cover object-center"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                title="Edit Banner"
              />
              {/* Avatar Overlapping */}
              <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
                <div className="relative">
                  <Avatar
                    src={avatarPreview}
                    alt="Profile Picture"
                    sx={{ width: 96, height: 96, border: '4px solid white', boxShadow: 2, background: '#fff' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ width: 96, height: 96, borderRadius: '50%' }}
                    title="Edit Avatar"
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="pt-16 px-6 pb-6">
              <TextField
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.errors.fullName}
                margin="normal"
              />
              <TextField
                fullWidth
                id="bio"
                label="Bio"
                name="bio"
                multiline
                minRows={3}
                value={formik.values.bio}
                onChange={formik.handleChange}
                error={formik.touched.bio && Boolean(formik.errors.bio)}
                helperText={formik.errors.bio}
                margin="normal"
              />
              <TextField
                fullWidth
                id="website"
                label="Website"
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.errors.website}
                margin="normal"
              />
              <TextField
                fullWidth
                id="location"
                label="Location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.errors.location}
                margin="normal"
              />
              <div className="my-3">
                <p className="text-lg">Birth Date . Edit</p>
                <p className="text-2xl"> October 26, 1999</p>
                
              </div>
              <p className = "py-3 text-lg">Edit professional Profile</p>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
