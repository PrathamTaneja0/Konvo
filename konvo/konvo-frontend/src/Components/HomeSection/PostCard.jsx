import React from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import userIcon from "../../assets/userIcon.png";
import verify from "../../assets/verify.png";
import TeamIgris from "../../assets/TeamIgris.png";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FavouriteIcon from "@mui/icons-material/Favorite";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReplyModal from "./ReplyModal";
import { useDispatch, useSelector } from "react-redux";
import { likePost, dislikePost, createRePost, deleteRePost, deletePost } from "../../Store/Post/Action";
import Tooltip from '@mui/material/Tooltip';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [replyModalOpen, setReplyModalOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const allPosts = useSelector((store) => store.post.posts);

  console.log("PostCard - Current post data:", {
    id: post.id,
    isRepost: post.isRepost,
    repost: post.repost,
    repostFor: post.repostFor,
    user: post.user,
    content: post.content,
    totalRePosts: post.totalRePosts
  });

  const isRepost = post.isRepost || post.repost;
  const displayPost = isRepost && post.repostFor ? post.repostFor : post;
  const userHasReposted = allPosts.some(
    p => (p.isRepost || p.repost) && p.repostFor && p.repostFor.id === displayPost.id && p.user?.id === auth.user?.id
  );

  console.log("PostCard - Computed repost state:", {
    isRepost,
    userHasReposted,
    totalRePosts: displayPost.totalRePosts,
    displayPostId: displayPost.id
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenReplyModel = () => {
    setReplyModalOpen(true);
  };

  const handleCloseReplyModel = () => {
    setReplyModalOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLike = () => {
    if (!auth.jwt) return;
    if (post.liked) {
      dispatch(dislikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  };

  const handleRepost = () => {
    if (!auth.jwt) return;
    if (userHasReposted) {
      dispatch(deleteRePost(displayPost.id));
    } else {
      dispatch(createRePost(displayPost.id));
    }
  };

  const handleDeletePost = () => {
    console.log("Attempting to delete post:", post.id);
    if (post.user?.id === auth.user?.id) {
      console.log("User authorized to delete. Dispatching delete action...");
      dispatch(deletePost(post.id));
    } else {
      console.log("User not authorized to delete this post");
    }
    handleClose();
  };

  const handleEdit = () => {
    // Implement edit logic
    handleClose();
  };

  const isUsersPost = post.user?.id === auth.user?.id;
  console.log("Post ownership:", { 
    postUserId: post.user?.id, 
    currentUserId: auth.user?.id, 
    isUsersPost 
  });

  console.log("liked:", post.liked, "id:", post.id);

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex space-x-5">
        <Avatar
          onClick={() => navigate(`/profile/${post.user?.id}`)}
          className="cursor-pointer"
          alt="username"
          src={post.user?.image || userIcon}
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex cursor-pointer space-x-2 items-center">
              <span className="font-semibold">{post.user?.fullName}</span>
              <span className="opacity-70">@{post.user?.username}</span>
              {post.user?.is_verified && (
                <img className="w-4 h-4 ml-2" src={verify} alt="verified" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="opacity-70 text-sm">
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}
              </span>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ minWidth: "auto", padding: "5px" }}
              >
                <MoreHorizIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {isUsersPost ? [
                  <MenuItem key="delete" onClick={handleDeletePost}>Delete</MenuItem>,
                  <MenuItem key="edit" onClick={handleEdit}>Edit</MenuItem>
                ] : null}
              </Menu>
            </div>
          </div>
          <div className="mt-2">
            <div className="cursor-pointer" onClick={() => navigate(`/tweet/${post.id}`)}>
              <p className="mb-2 p-0">{post.content}</p>
              {post.image && (
                <img
                  className="w-full max-w-2xl border border-gray-400 p-5 rounded-md"
                  src={post.image}
                  alt="Post"
                />
              )}
            </div>
            <div className="py-5 flex flex-wrap justify-between items-center">
              <div className="space-x-3 flex items-center text-gray-600">
                <ChatBubbleOutlineIcon
                  className="cursor-pointer"
                  onClick={handleOpenReplyModel}
                />
                <span>{post.totalReplies ?? 0}</span>
              </div>
              <div className={`space-x-3 flex items-center ${userHasReposted ? "text-green-500" : "text-gray-600"}`}>
                <Tooltip title={userHasReposted ? "Undo repost" : "Repost"}>
                  <RepeatIcon
                    className="cursor-pointer"
                    onClick={handleRepost}
                  />
                </Tooltip>
                <span>{displayPost.totalRePosts ?? 0}</span>
              </div>
              <div className="space-x-3 flex items-center">
                {post.liked ? (
                  <FavouriteIcon
                    className="cursor-pointer"
                    onClick={handleLike}
                    color="error"
                  />
                ) : (
                  <FavoriteBorderIcon
                    className="cursor-pointer"
                    onClick={handleLike}
                    color="action"
                  />
                )}
                <span>{post.totalLikes ?? 0}</span>
              </div>
              <div className="space-x-3 flex items-center text-gray-600">
                <BarChartIcon className="cursor-pointer" />
                <span>{post.viewCount ?? 0}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FileUploadIcon className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {replyModalOpen && (
        <ReplyModal open={replyModalOpen} onClose={handleCloseReplyModel} post={post} />
      )}
    </div>
  );
}

export default PostCard;
