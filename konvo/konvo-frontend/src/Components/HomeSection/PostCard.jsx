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

function PostCard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isReposted, setIsReposted] = React.useState(false);
  const [replyModalOpen, setReplyModalOpen] = React.useState(false);
  const open = Boolean(anchorEl);

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
    setIsLiked(!isLiked);
    console.log("Like toggled:", !isLiked);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    console.log("Repost toggled:", !isReposted);
  };

  const handleDeletePost = () => {
    console.log("Delete Post");
    handleClose();
  };

  const handleEdit = () => {
    console.log("Edit Post");
    handleClose();
  };

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex space-x-5">
        <Avatar
          onClick={() => navigate(`/profile/6`)}
          className="cursor-pointer"
          alt="username"
          src={userIcon}
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex cursor-pointer space-x-2 items-center">
              <span className="font-semibold">Snax Dark</span>
              <span className="text-gray-600">@Snax123 . 2m</span>
              <img className="w-4 h-4 ml-2" src={verify} alt="verified" />
            </div>

            <div>
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
                <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
              </Menu>
            </div>
          </div>

          <div className="mt-2">
            <div className="cursor-pointer" onClick={() => navigate(`/tweet/1`)}>
              <p className="mb-2 p-0">Brain Rot code </p>
              <img
                className="w-full max-w-2xl border border-gray-400 p-5 rounded-md"
                src={TeamIgris}
                alt="Team Igris"
              />
            </div>

            <div className="py-5 flex flex-wrap justify-between items-center">
              <div className="space-x-3 flex items-center text-gray-600">
                <ChatBubbleOutlineIcon
                  className="cursor-pointer"
                  onClick={handleOpenReplyModel}
                />
                <span>43</span>
              </div>

              <div
                className={`space-x-3 flex items-center ${
                  isReposted ? "text-green-500" : "text-gray-600"
                }`}
              >
                <RepeatIcon
                  className="cursor-pointer"
                  onClick={handleRepost}
                />
                <span>53</span>
              </div>

              <div
                className={`space-x-3 flex items-center ${
                  isLiked ? "text-pink-600" : "text-gray-600"
                }`}
              >
                {isLiked ? (
                  <FavouriteIcon
                    className="cursor-pointer"
                    onClick={handleLike}
                  />
                ) : (
                  <FavoriteBorderIcon
                    className="cursor-pointer"
                    onClick={handleLike}
                  />
                )}
                <span>53</span>
              </div>

              <div className="space-x-3 flex items-center text-gray-600">
                <BarChartIcon className="cursor-pointer" />
                <span>430</span>
              </div>

              <div className="flex items-center text-gray-600">
                <FileUploadIcon className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {replyModalOpen && (
        <ReplyModal open={replyModalOpen} onClose={handleCloseReplyModel} />
      )}
    </div>
  );
}

export default PostCard;
