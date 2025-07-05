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
import useColorMode from "../../theme/useColorMode";
import uploadToCloudinary from "../../../Utils/uploadToCloudinary";

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
  const [avatarPreview, setAvatarPreview] = useState(initialValues?.image || "");
  const [saving, setSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useColorMode();

  const handleSubmit = async (values) => {
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('bio', values.bio);
      formData.append('website', values.website);
      formData.append('location', values.location);
      if (values.backgroundImage instanceof File) {
        formData.append('backgroundImage', values.backgroundImage);
      }
      if (values.image) {
        formData.append('image', values.image);
      }
      // Place your backend API call here if needed
      if (onSave) onSave(values);
      if (onClose) onClose();
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues || {
      fullName: "",
      website: "",
      location: "",
      bio: "",
      backgroundImage: "",
      image: "",
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  React.useEffect(() => {
    if (open) {
      formik.resetForm({ values: initialValues });
      setBannerPreview(initialValues?.backgroundImage || moon);
      setAvatarPreview(initialValues?.image || "");
    }
    // eslint-disable-next-line
  }, [open, initialValues]);

  const handleImageChange = async (event, field, setPreview, setSelected, setUploading) => {
    setUploading(true);
    setError("");
    try {
      const file = event.target.files[0];
      if (file) {
        const uploadedUrl = await uploadToCloudinary(file);
        if (uploadedUrl) {
          setPreview(uploadedUrl);
          setSelected(uploadedUrl);
          formik.setFieldValue(field, uploadedUrl);
        } else {
          setPreview(URL.createObjectURL(file));
          setSelected("");
          formik.setFieldValue(field, "");
        }
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, backgroundColor: theme.palette.background.default }}>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex items-center justify-between px-4 py-2 border-b sticky top-0 z-10" style={{ borderColor: theme.palette.divider, backgroundColor: theme.palette.background.paper }}>
            <div className="flex items-center">
              <IconButton onClick={onClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="subtitle1" className="ml-2">Edit Profile</Typography>
            </div>
            <Button type="submit" variant = "contained "  color="inherit" sx={{ fontWeight: 600 }} disabled={uploadedImage || saving || uploadingAvatar} >
              {saving ? 'Saving...' : uploadingAvatar ? 'Uploading...' : 'Save'}
            </Button>
          </div>
          {error && (
            <div className="px-4 py-2 text-red-600 text-sm bg-red-50 border-b border-red-200">{error}</div>
          )}
          <div className="overflow-y-auto max-h-[80vh]">
            <div className="relative w-full h-[180px] ">
              <img
                src={bannerPreview}
                alt="Banner"
                className="w-full h-[180px] object-cover object-center"
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageChange(e, "backgroundImage", setBannerPreview, () => {}, setUploadedImage)}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                title="Edit Banner"
              />
              <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
                <div className="relative">
                  <Avatar
                    src={avatarPreview || selectedAvatar || initialValues?.image || ""}
                    alt="Profile Picture"
                    sx={{ width: 96, height: 96, border: '4px solid white', boxShadow: 2, background: '#fff' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(e, "image", setAvatarPreview, setSelectedAvatar, setUploadingAvatar)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ width: 96, height: 96, borderRadius: '50%' }}
                    title="Edit Avatar"
                  />
                </div>
              </div>
            </div>
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
                id="location"
                label="Location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.errors.location}
                margin="normal"
              />
              <TextField
                fullWidth
                id="birthDate"
                label="Birthday"
                name="birthDate"
                type="date"
                value={formik.values.birthDate || ''}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
