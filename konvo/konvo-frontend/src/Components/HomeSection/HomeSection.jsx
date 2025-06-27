import React, { useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "../../Store/Post/Action";
import { api } from "../Config/api";

const validationSchema = Yup.object().shape({
  content: Yup.string()
    .required("Post text is required")
    .max(280, "Post cannot exceed 280 characters"),
});

const HomeSection = () => {
  const { theme } = useColorMode();
  const { post } = useSelector(store => store);
  const dispatch = useDispatch();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await api.post("/api/posts/create", { content: values.content });
      console.log("Post created:", response.data);
      resetForm();
      dispatch(getAllPosts());
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

  useEffect(()=>{
    dispatch(getAllPosts())
  }, [post.like, post.repost] )

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
                      <FmdGoodIcon />
                      <TagFacesIcon />
                    </div>
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
                </div>
              </form>
            </div>
          </div>
        </section>

        <section>
          {post.posts.map((postItem) => <PostCard key={postItem.id} post={postItem} />)}
        </section>
      </div>
    </div>
  );
};

export default HomeSection;
//testing 2
