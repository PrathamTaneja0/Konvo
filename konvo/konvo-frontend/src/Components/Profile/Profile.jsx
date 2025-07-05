import React, { useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useParams } from "react-router-dom";
import moon from "../../assets/moon.jpg";
import userIcon from "../../assets/userIcon.png";
import { Avatar, Button, Box } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
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
import { getUserProfilePosts, getMyAuthoredPosts, clearProfilePosts } from "../../Store/Post/Action";

const Profile = () => {
  const { theme } = useColorMode();
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const post = useSelector((store) => store.post);
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

  React.useEffect(() => {
    if (user.id) {
      loadPosts();
    }
  }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: Intentionally excluding loadPosts from dependencies to prevent infinite re-renders.
  // loadPosts is defined in the same component and doesn't need to be in dependencies.

  // Separate useEffect to handle like/repost updates
  React.useEffect(() => {
    if (user.id && (post.like || post.repost)) {
      // Only reload if we have a user and there was a like/repost action
      loadPosts();
    }
  }, [post.like?.id, post.repost?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: Intentionally excluding loadPosts and user.id from dependencies to prevent unnecessary re-renders.
  // Only tracking specific post interaction IDs that should trigger a reload.

  React.useEffect(() => {
    return () => {
      dispatch(clearProfilePosts());
    };
  }, [dispatch]);

  const loadPosts = () => {
    if (!user.id) return;
    
    if (isOwnProfile) {
      // For own profile, use getMyAuthoredPosts() to show only authored posts (not reposts)
      dispatch(getMyAuthoredPosts());
    } else {
      // For other users, use profile posts (more permissive than F-V2)
      dispatch(getUserProfilePosts(user.id));
    }
  };

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

  const renderPosts = () => {
    // Always use profilePosts for profile page
    const postsToShow = post.profilePosts;
    const isLoading = post.profilePostsLoading;
    const error = post.profilePostsError;

    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <p>Loading posts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (!postsToShow || postsToShow.length === 0) {
      return (
        <div className="flex justify-center items-center py-8">
          <p>No posts found.</p>
        </div>
      );
    }

    return (
      <div>
        {postsToShow.slice(0, 20).map((postItem) => (
          <PostCard key={postItem.id} post={postItem} posts={postsToShow} isProfile={true} profileUserId={user.id} />
        ))}
      </div>
    );
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

      {/* Posts Section */}
      <section className="mt-6">
        <div className="border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-semibold">Posts</h2>
        </div>
        <div className="mt-4">
          {renderPosts()}
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
