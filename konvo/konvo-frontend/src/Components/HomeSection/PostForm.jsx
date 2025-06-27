import React from "react";
import { Avatar, Button } from "@mui/material";
import user1 from "../../assets/user1.webp";
import * as Yup from "yup";
import { useFormik } from "formik";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import useColorMode from "../../theme/useColorMode";
import TextField from "@mui/material/TextField";
import { api } from "../Config/api";

const validationSchema = Yup.object().shape({
  content: Yup.string()
    .required("Post text is required")
    .max(280, "Post cannot exceed 280 characters"),
});

const PostForm = ({ onPostSuccess }) => {
  const { theme } = useColorMode();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await api.post("/api/posts/create", { content: values.content });
      console.log("Post created:", response.data);
      resetForm();
      if (onPostSuccess) onPostSuccess();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: handleSubmit,
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex space-x-5 items-center">
        <Avatar alt="username" src={user1} />
        <TextField
          name="content"
          placeholder="What's happening?"
          variant="standard"
          fullWidth
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
        <TagFacesIcon />
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: "29px",
            paddingX: "20px",
            bgcolor: "#000000",
            "&:hover": {
              bgcolor: "#1a91da",
            },
          }}
        >
          Post
        </Button>
      </div>
      {formik.touched.content && formik.errors.content && (
        <div className="text-red-500 mt-2">{formik.errors.content}</div>
      )}
    </form>
  );
};

export default PostForm; 