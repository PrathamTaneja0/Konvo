import React from "react";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import userIcon from "../../assets/userIcon.png";
import verify from "../../assets/verify.png";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../Store/Post/Action";
import { formatDistanceToNow } from 'date-fns';
import useColorMode from "../../theme/useColorMode";

function ReplyCard({ post, onReplyDeleted }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const { theme } = useColorMode();

  // Fallbacks for missing fields
  const fullName = post.user?.fullName || 'Unknown User';
  const username = post.user?.username || 'unknown';
  const content = post.content || '[No content]';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    if (post.user?.id === auth.user?.id) {
      dispatch(deletePost(post.id)).then(() => {
        if (onReplyDeleted) onReplyDeleted();
      });
    }
    handleClose();
  };

  const isUsersPost = post.user?.id === auth.user?.id;

  return (
    <div
      className="border-b p-4"
      style={{
        background: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
      }}
    >
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
              <span className="font-semibold">{fullName}</span>
              <span className="opacity-70">@{username}</span>
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
                  <MenuItem key="delete" onClick={handleDeletePost}>Delete</MenuItem>
                ] : null}
              </Menu>
            </div>
          </div>
          <div className="mt-2">
            <p className="mb-2 p-0">{content}</p>
            {post.image && (
              <img
                className="w-full max-w-2xl border border-gray-400 p-5 rounded-md"
                src={post.image}
                alt="Reply"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReplyCard; 