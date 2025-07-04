import React, { useEffect } from "react";
import { Typography, Avatar, Box } from "@mui/material";
import PostCard from "./PostCard";
import useColorMode from "../../theme/useColorMode";
import { useSelector, useDispatch } from "react-redux";
import { getFollowedUserPosts } from "../../Store/Post/Action";

const UserPostsSection = ({ userId, userName }) => {
  const { theme } = useColorMode();
  const post = useSelector((store) => store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(getFollowedUserPosts(userId));
    }
  }, [userId, post.like, post.repost, dispatch]);

  const renderPosts = () => {
    if (post.loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Typography>Loading posts...</Typography>
        </div>
      );
    }
    if (post.error) {
      return (
        <div className="flex justify-center items-center py-8">
          <Typography color="error">{post.error}</Typography>
        </div>
      );
    }
    if (!post.posts || post.posts.length === 0) {
      return (
        <div className="flex justify-center items-center py-8">
          <Typography>No posts found from this user.</Typography>
        </div>
      );
    }
    return (
      <div>
        {post.posts.slice(0, 20).map((postItem) => (
          <PostCard key={postItem.id} post={postItem} posts={post.posts} />
        ))}
      </div>
    );
  };

  return (
    <main>
      <div className="max-w-xl mx-auto px-4">
        <header>
          <Box className="py-5 flex items-center gap-3">
            <Avatar src={post.posts?.[0]?.user?.image} alt={userName} />
            <Typography variant="h6" className="font-bold opacity-90">
              {userName}'s Posts
            </Typography>
          </Box>
        </header>
        <section>{renderPosts()}</section>
      </div>
    </main>
  );
};

export default UserPostsSection; 