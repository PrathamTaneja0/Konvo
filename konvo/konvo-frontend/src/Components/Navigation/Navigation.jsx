import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { navigationMenu } from "./NavigationMenu";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Menu, MenuItem } from "@mui/material";
import userIcon from "../../assets/userIcon.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Store/Auth/Action.js";
import PostForm from "../HomeSection/PostForm";
import Modal from "@mui/material/Modal";
import { getAllPosts } from "../../Store/Post/Action";
import useColorMode from "../../theme/useColorMode";

const Navigation = ({ onNavItemClick }) => {
  const auth = useSelector((store) => store.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    handleClose();
    dispatch(logout(navigate));
  };
  const [postModalOpen, setPostModalOpen] = useState(false);
  const handleOpenPostModal = () => setPostModalOpen(true);
  const handleClosePostModal = () => {
    setPostModalOpen(false);
    dispatch(getAllPosts());
  };
  const { theme } = useColorMode();
  const userId = auth.user?.id;
  return (
    <nav className="h-screen sticky top-0 flex flex-col justify-between px-4">
      <div>
        <header className="py-5 flex">
          <img
            src={logo}
            alt="logo"
            className="cursor-pointer"
            width={50}
            height={50}
            onClick={() => navigate("/home")}
          />
        </header>
        <section className="space-y-6">
          {navigationMenu.map((item) => (
            <div
              key={item.path}
              className="cursor-pointer flex space-x-3 items-center"
              onClick={() => {
                if (item.title === "Profile") {
                  if (userId) {
                    navigate(`/profile/${userId}`);
                  }
                } else {
                  navigate(item.path);
                }
                if (onNavItemClick) {
                  onNavItemClick();
                }
              }}
            >
              {item.icon}
              <p className="text-xl">{item.title}</p>
            </div>
          ))}
        </section>
      </div>
      <section className="flex flex-col items-center mb-4">
        <Button
          sx={{
            width: "80%",
            borderRadius: "29px",
            py: "15px",
            px: 3,
            bgcolor: "#000000",
            mb: 2,
            "&:hover": {
              bgcolor: "#1a91da",
            },
          }}
          variant="contained"
          onClick={handleOpenPostModal}
        >
          Post
        </Button>
        <Modal open={postModalOpen} onClose={handleClosePostModal}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 16,
              boxShadow: 24,
              padding: 24,
              minWidth: 350,
              outline: "none",
            }}
          >
            <PostForm onPostSuccess={handleClosePostModal} />
          </div>
        </Modal>
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center space-x-3">
            <Avatar alt={auth.user?.fullName || "username"} src={auth.user?.image || userIcon} />
          </div>
          <div>
            <p>{auth.user?.fullName}</p>
            <span className="opacity-70 ml-2 block">@{auth.user?.username}</span>
          </div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            aria-labelledby="basic-button"
          >
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </div>
      </section>
    </nav>
  );
};

export default Navigation;
