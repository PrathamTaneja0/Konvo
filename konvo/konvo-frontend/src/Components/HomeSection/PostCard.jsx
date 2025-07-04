import React from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import userIcon from "../../assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavouriteIcon from "@mui/icons-material/Favorite";
import ReplyModal from "./ReplyModal";
import { useDispatch, useSelector } from "react-redux";
import { repostPost, undoRepost, likePost, dislikePost, deletePost } from "../../Store/Post/Action";
import Tooltip from '@mui/material/Tooltip';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post, isReply = false, isProfile = false, profileUserId = null }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [replyModalOpen, setReplyModalOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);


  // Only glow repost button on original posts if user has reposted
  let userHasReposted = false;
  if (!post.repost && post.reposted) {
    userHasReposted = post.reposted;
  }

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
      dispatch(dislikePost(post.id, isProfile, profileUserId));
    } else {
      dispatch(likePost(post.id, isProfile, profileUserId));
    }
  };

  const handleRepost = () => {
    if (!auth.jwt) return;
    if (userHasReposted) {
      dispatch(undoRepost(post.id, isProfile, profileUserId));
    } else {
      dispatch(repostPost(post.id, isProfile, profileUserId));
    }
  };

  const handleDeletePost = () => {
    if (post.user?.id === auth.user?.id) {
      if (post.isRepost && post.repostFor && post.repostFor.id) {
        dispatch(deletePost(post.id, post.repostFor.id));
      } else {
        dispatch(deletePost(post.id));
      }
    }
    handleClose();
  };

  const isUsersPost = post.user?.id === auth.user?.id;

  console.log("liked:", post.liked, "id:", post.id);

  // Fallbacks for missing fields
  const fullName = post.user?.fullName || 'Unknown User';
  const username = post.user?.username || 'unknown';
  const content = post.content || '[No content]';

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
            <div 
              className="flex cursor-pointer space-x-2 items-center"
              onClick={() => navigate(`/profile/${post.user?.id}`)}
            >
              <span className="font-semibold">{fullName}</span>
              <span className="opacity-70">@{username}</span>
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
                slotProps={{
                  menuList: {
                    'aria-labelledby': 'basic-button',
                  },
                }}
              >
                {isUsersPost ? [
                  <MenuItem key="delete" onClick={handleDeletePost}>Delete</MenuItem>
                ] : null}
              </Menu>
            </div>
          </div>
          <div className="mt-2">
            <div
              className={isReply ? undefined : "cursor-pointer"}
              onClick={isReply ? undefined : () => navigate(`/post/${post.id}`)}
            >
              <p className="mb-2 p-0">{content}</p>
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
                <Tooltip key={userHasReposted ? "undo" : "repost"} title={userHasReposted ? "Undo repost" : "Repost"}>
                  <button
                    onClick={handleRepost}
                    className={`p-2 rounded-full transition-colors ${userHasReposted ? 'text-green-500 bg-green-50 hover:bg-green-100' : 'text-gray-500 hover:text-green-500 hover:bg-green-50'}`}
                  >
                    <RepeatIcon />
                  </button>
                </Tooltip>
                <span className={`text-sm ${userHasReposted ? 'text-green-500' : 'text-gray-500'}`}>{post.totalRePosts ?? 0}</span>
              </div>
              <div className="space-x-3 flex items-center">
                <Tooltip title={isUsersPost ? "You cannot like your own post." : (post.liked ? "Unlike" : "Like")}>
                  <span>
                    {post.liked ? (
                      <FavouriteIcon
                        className={`cursor-pointer ${isUsersPost ? 'pointer-events-none text-gray-400' : ''}`}
                        color={isUsersPost ? undefined : "error"}
                        onClick={e => {
                          if (isUsersPost) return;
                          handleLike();
                        }}
                        style={isUsersPost ? { opacity: 0.5 } : {}}
                        data-testid="like-button"
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className={`cursor-pointer ${isUsersPost ? 'pointer-events-none text-gray-400' : ''}`}
                        color={isUsersPost ? undefined : "action"}
                        onClick={e => {
                          if (isUsersPost) return;
                          handleLike();
                        }}
                        style={isUsersPost ? { opacity: 0.5 } : {}}
                        data-testid="like-button"
                      />
                    )}
                  </span>
                </Tooltip>
                <span>{post.totalLikes ?? 0}</span>
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
