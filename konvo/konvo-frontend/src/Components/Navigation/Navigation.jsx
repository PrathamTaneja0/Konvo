import React from "react";
import logo from "../../assets/logo.png";
import { navigationMenu } from "./NavigationMenu";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Menu, MenuItem } from "@mui/material";
import userIcon from "../../assets/userIcon.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const Navigation = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logout");
    handleClose();
  };
  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between px-4">
      <div>
        <div className="py-5 flex">
          <img
            src={logo}
            alt="logo"
            className=" "
            width={50}
            height={50}
          />
        </div>
        <div className="space-y-6">
          {navigationMenu.map((item) => (
            <div
              key={item.path}
              className="cursor-pointer flex space-x-3 items-center"
              onClick={() =>
                item.title === "Profile"
                  ? navigate(`/profile/${50}`)
                  : navigate(item.path)
              }
            >
              {item.icon}
              <p className="text-xl">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="py-6 flex justify-center">
          <Button
            sx={{ width: "100%", borderRadius: "29px", py: "15px", bgcolor: 'light blue', px: 3 }}
            variant="contained"
          >
            Post
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar alt="username" src={userIcon} />
        </div>
        <div>
          <span>Snax Dark</span>
          <span className="opacity-70 ml-2 block">@Snax123</span>
        </div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navigation;
