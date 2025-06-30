import React, { useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useParams } from "react-router-dom";
import moon from "../../assets/moon.jpg";
import userIcon from "../../assets/userIcon.png";
import { Avatar, Button, Box, Tabs, Tab } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import verify from "../../assets/verify.png";
import PostCard from "../HomeSection/PostCard";
import ProfileModal from "./ProfileModal";
import useColorMode from "../../theme/useColorMode";
import CakeIcon from "@mui/icons-material/Cake";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserProfile,
  findUserById,
  followUserAction,
} from "../../Store/Auth/Action";

const Profile = () => {
  const { theme } = useColorMode();
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const { id } = useParams();
  const loggedInUser = auth.user || {};
  const otherUser = auth.findUser || {};
  const isOwnProfile = !id || String(loggedInUser.id) === String(id);
  const user = isOwnProfile ? loggedInUser : otherUser;
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => {
    if (!id || !loggedInUser.id) return; // Wait until both are defined
    if (String(loggedInUser.id) !== String(id)) {
      dispatch(findUserById(id));
    }
  }, [id, loggedInUser.id, dispatch]);

  const handleOpenProfileModel = () => {
    setModalOpen(true);
  };

  const handleCloseProfileModel = () => {
    setModalOpen(false);
  };

  const handleSaveProfile = async (values) => {
    // Ensure location defaults to 'Earth' if empty
    const updatedValues = { ...values, location: values.location || "Earth" };
    await dispatch(updateUserProfile(updatedValues));
    setModalOpen(false);
  };

  const handleFollowUser = () => {
    dispatch(followUserAction(user.id));
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full">
      <section
        className={" z-50 flex items-center sticky top-0 bg-opacity-95 "}
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <KeyboardBackspaceIcon
          className="cursor-pointer"
          onClick={handleBack}
        />
        <h1 className={"text-xl font-bold py-5 opacity-90 ml-5"}>Profile</h1>
      </section>
      <section className="relative">
        <img
          className="w-full h-[15rem] object-cover"
          src={user.backgroundImage || moon}
          alt="profile"
        />
        <Avatar
          alt={user.fullName}
          src={user.image || userIcon}
          sx={{
            width: "8rem",
            height: "8rem",
            border: "4px solid white",
            position: "absolute",
            left: "2rem",
            bottom: "-4rem",
            bgcolor: "white",
            cursor: isOwnProfile ? "pointer" : "default",
          }}
          onClick={isOwnProfile ? handleOpenProfileModel : undefined}
        />
        {isOwnProfile ? (
          <Button
            onClick={handleOpenProfileModel}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "20px",
              position: "absolute",
              right: "2rem",
              bottom: "-4rem",
              paddingX: "1.5rem",
              paddingY: "0.5rem",
              bgcolor: theme.palette.mode === "dark" ? "#000" : "#000",
              color: theme.palette.mode === "dark" ? "#fff" : "#fff",
              // fontWeight: 600,
              // '&:hover': {
              //   bgcolor: theme.palette.primary.dark,
              // },
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            onClick={handleFollowUser}
            variant={user.followed ? "contained" : "outlined"}
            color={user.followed ? "primary" : "inherit"}
            sx={{
              borderRadius: "20px",
              position: "absolute",
              right: "2rem",
              bottom: "-4rem",
              paddingX: "1.5rem",
              paddingY: "0.5rem",
              bgcolor: user.followed
                ? theme.palette.mode === 'dark' ? '#000' : '#000'
                : theme.palette.mode === 'dark' ? '#000' : '#000',
              color: user.followed
                ? theme.palette.mode === 'dark' ? '#fff' : '#fff'
                : theme.palette.mode === 'dark' ? '#fff' : '#fff',
              border: user.followed
                ? "none"
                : `1px solid ${theme.palette.divider}`, 
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            {user.followed ? "Following" : "Follow"}
          </Button>
        )}
      </section>
      <section>
        <div style={{ height: "4rem" }} />
        <div className="flex items-center px-4">
          <h1 className="font-bold text-lg">{user.fullName}</h1>
          <img className="w-4 h-4 ml-2" src={verify} alt="verified" />
        </div>
        <h1 className="text-gray-500 px-4">@{user.username}</h1>
        <div className="mt-2 space-y-3 px-4">
          <p>{user.bio}</p>
          <div className="py-1 flex space-x-5">
            <div className="flex items-center text-gray-500">
              <LocationOnIcon />
              <p className="ml-2">{user.location || "Earth"}</p>
            </div>
            <div className="flex items-center text-gray-500">
              <CakeIcon />
              <p className="ml-2">{user.birthDate ? user.birthDate : "-"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-1 ">
              <span className="font-semibold">
                {user.following ? user.following.length : 0}
              </span>
              <span className="ml-1 text-gray-500">Following</span>
            </div>
            <div className="flex items-center space-x-1 ">
              <span className="font-semibold">
                {user.followers ? user.followers.length : 0}
              </span>
              <span className="ml-1 text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </section>
      {isOwnProfile && (
        <ProfileModal
          open={modalOpen}
          onClose={handleCloseProfileModel}
          initialValues={{
            ...user,
            location: user.location || "Earth",
            birthDate: user.birthDate || "",
          }}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default Profile;
