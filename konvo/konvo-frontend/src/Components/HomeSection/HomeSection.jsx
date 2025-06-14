import React from "react";
import { Avatar, Button } from "@mui/material";
import user1 from "../../assets/user1.webp";
import * as Yup from "yup";
import { useFormik } from "formik";
import ImageIcon from "@mui/icons-material/Image";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import PostCard from "./PostCard";
import useColorMode from "../../theme/useColorMode";
import TextField from "@mui/material/TextField";
const validationSchema = Yup.object().shape({
  content: Yup.string()
    .required("Post text is required")
    .max(280, "Post cannot exceed 280 characters"),
});

const HomeSection = () => {
  const [uploadedImage, setUploadedImage] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(null);
  const { theme } = useColorMode();
  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
  };

  const formik = useFormik({
    initialValues: {
      content: "",
      image: "",
    },
    onSubmit: handleSubmit,
    validationSchema,
  });

  const handleSelectImage = (event) => {
    setUploadedImage(true);
    const imgFile = event.target.files[0];
    formik.setFieldValue("image", imgFile);
    setImagePreviewUrl(imgFile);
    setUploadedImage(false);
  };

  // Clean up the object URL when component unmounts or image changes
  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <div >
      <div className="max-w-xl mx-auto px-4">
        <section>
          <h1 className="py-5 text-xl font-bold opacity-90">Home</h1>
        </section>
        
        <section className="pb-5 border-b border-gray-100"    style={{ backgroundColor: theme.palette.background.default }}>
          <div className="flex space-x-5">
            <Avatar alt="username" src={user1} />
            <div className="w-full">
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <TextField
                      name="content"
                      placeholder="What's happening?"
                      variant="standard"
                      fullWidth
                      // sx={{
                      //   '& .MuiInput-root': {
                      //     fontSize: '1.25rem',
                      //     '&:before': { display: 'none' },
                      //     '&:after': { display: 'none' },
                      //   },
                      //   '& .MuiInputBase-input::placeholder': {
                      //     color: theme.palette.text.secondary,
                      //     opacity: 1
                      //   }
                      // }}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                          WebkitTextFillColor: theme.palette.text.primary,
                          transition: 'background-color 5000s ease-in-out 0s'
                        },
                        '& input:-webkit-autofill:hover': {
                          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                          WebkitTextFillColor: theme.palette.text.primary
                        },
                        '& input:-webkit-autofill:focus': {
                          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                          WebkitTextFillColor: theme.palette.text.primary
                        }
                      }}
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
                        // bgcolor: "#1da1f2",
                        bgcolor: "#000000",

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

        {/* Posts Section */}
        <section>
          <PostCard />
          <PostCard />
          <PostCard />
        </section>
      </div>
    </div>
  );
};

export default HomeSection;
//testing 2
