import React, { useEffect, useState } from "react";
import { Avatar, Button, Tabs, Tab, Box, Typography } from "@mui/material";
import PostCard from "./PostCard";
import useColorMode from "../../theme/useColorMode";
import { useSelector, useDispatch } from "react-redux";
import { 
    getAllPosts, 
    getMyPosts, 
    getFollowedUserPosts, 
    getTimeline 
} from "../../Store/Post/Action";

const PostSection = ({ userId = null }) => {
  const { theme } = useColorMode();
  const post = useSelector(store => store.post);
  const auth = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Load initial posts based on active tab
    loadPostsForTab(activeTab);
  }, [activeTab, post.like, post.repost, auth.user?.following?.length]);

  const loadPostsForTab = (tabIndex) => {
    switch (tabIndex) {
      case 0: // All Posts
        dispatch(getAllPosts());
        break;
      case 1: // My Posts (F-V1)
        dispatch(getMyPosts());
        break;
      case 2: // Timeline (F-V3)
        dispatch(getTimeline());
        break;
      case 3: // Specific User Posts (F-V2) - only if userId is provided
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

  const getTabLabel = (index) => {
    switch (index) {
      case 0:
        return "All Posts";
      case 1:
        return "My Posts";
      case 2:
        return "Timeline";
      case 3:
        return userId ? "User Posts" : "All Posts";
      default:
        return "All Posts";
    }
  };

  const shouldShowTabs = () => {
    // Show tabs if we're not viewing a specific user's posts
    return !userId;
  };

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
          <PostCard key={postItem.id} post={postItem} posts={post.posts} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="max-w-xl mx-auto px-4">
        {shouldShowTabs() && (
          <section className="pb-5 border-b border-gray-100" style={{ backgroundColor: theme.palette.background.default }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          </section>
        )}

        <section>
          {renderPosts()}
        </section>
      </div>
    </div>
  );
};

export default PostSection; 