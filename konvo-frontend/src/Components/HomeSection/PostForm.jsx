import React, { useState } from "react";
import { Avatar, Button } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import useColorMode from "../../theme/useColorMode";
import TextField from "@mui/material/TextField";
import { api } from "../Config/api";
import userIcon from "../../assets/userIcon.png";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  content: Yup.string()
    .required("Post text is required")
    .max(280, "Post cannot exceed 280 characters"),
});

const PostForm = ({ onPostSuccess }) => {
  const { theme } = useColorMode();
  const auth = useSelector((store) => store.auth);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (values, { resetForm }) => {
    setErrorMsg("");
    try {
      await api.post("/api/posts/create", { content: values.content });
      resetForm();
      if (onPostSuccess) onPostSuccess();
    } catch (err) {
      setErrorMsg(
        err?.userMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create post. Please try again."
      );
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
    <section>
      <form
        onSubmit={formik.handleSubmit}
        style={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}
      >
        <div className="flex space-x-5 items-center">
          <Avatar alt={auth?.user?.fullName || "username"} src={auth?.user?.image || userIcon} />
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
                transition: 'background-color 5000s ease-in-out 0s',
              },
              '& input:-webkit-autofill:hover': {
                WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                WebkitTextFillColor: theme.palette.text.primary,
              },
              '& input:-webkit-autofill:focus': {
                WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                WebkitTextFillColor: theme.palette.text.primary,
              },
            }}
            {...formik.getFieldProps("content")}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: "29px",
              paddingX: "20px",
              bgcolor: theme.palette.mode === "dark" ? "#000" : "#000",
              color: theme.palette.mode === "dark" ? "#fff" : "#fff",
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
        {errorMsg && (
          <div className="text-red-500 mt-2">{errorMsg}</div>
        )}
      </form>
    </section>
  );
};

export default PostForm;

// Prompt: "How do I implement character count validation for the post form?"
// Prompt: "The form submission is not working properly. How can I debug the API call?" 