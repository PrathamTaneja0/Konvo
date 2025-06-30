import React from "react";
import { Avatar, Button } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import useColorMode from "../../theme/useColorMode";
import TextField from "@mui/material/TextField";
import { api } from "../Config/api";
import user1 from "../../assets/user1.webp";

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
    <form onSubmit={formik.handleSubmit} style={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}>
      <div className="flex space-x-5 items-center">
        <Avatar alt="username" src={user1} />
        <TextField
          name="content"
          placeholder="What's happening?"
          variant="standard"
          fullWidth
          sx={{
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& input': {
              color: theme.palette.text.primary,
            },
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
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: "29px",
            paddingX: "20px",
            bgcolor: theme.palette.mode === 'dark' ? '#000' : '#000',
            color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
            "&:hover": {
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
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