import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import PostCard from "./PostCard";
import useColorMode from "../../theme/useColorMode";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllPosts,
  getMyPosts,
  getFollowedUserPosts,
  getTimeline,
} from "../../Store/Post/Action";

const PostSection = ({ userId = null }) => {
  const { theme } = useColorMode();
  const post = useSelector((store) => store.post);
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadPostsForTab(activeTab);
    // eslint-disable-next-line
  }, [activeTab, post.like, post.repost, auth.user?.following?.length]);

  const loadPostsForTab = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        dispatch(getAllPosts());
        break;
      case 1:
        dispatch(getMyPosts());
        break;
      case 2:
        dispatch(getTimeline());
        break;
      case 3:
        if (userId) {
          dispatch(getFollowedUserPosts(userId));
        }
        break;
      default:
        dispatch(getAllPosts());
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const shouldShowTabs = () => !userId;

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
          <Typography>No posts found.</Typography>
        </div>
      );
    }
    return (
      <div>
        {post.posts.slice(0, 20).map((postItem) => (
          <PostCard key={postItem.id} post={postItem} posts={post.posts} refreshType={
            activeTab === 2 ? "timeline" : activeTab === 1 ? "my" : "all"
          } />
        ))}
      </div>
    );
  };

  return (
    <main>
      <div className="max-w-xl mx-auto px-4">
        {shouldShowTabs() && (
          <header className="pb-5 border-b border-gray-100" style={{ backgroundColor: theme.palette.background.default }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="post tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All Posts" />
                <Tab label="My Posts" />
                <Tab label="Timeline" />
              </Tabs>
            </Box>
          </header>
        )}
        <section>{renderPosts()}</section>
      </div>
    </main>
  );
};

export default PostSection; 