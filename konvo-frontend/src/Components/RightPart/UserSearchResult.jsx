import React from "react";
import { Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import userIcon from "../../assets/userIcon.png";

const UserSearchResult = ({ users, onFollowToggle, currentUserId, theme, isDarkMode }) => {
  const navigate = useNavigate();
  if (!users || users.length === 0) {
    return <div className="text-center text-gray-500 py-2">No users found.</div>;
  }

  return (
    <section className="space-y-2">
      {users.map((user) => (
        <article
          key={user.id}
          className="flex items-center justify-between p-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${user.id}`)}>
            <Avatar src={user.image || userIcon} alt={user.username} />
            <div>
              <div className="font-semibold">@{user.username}</div>
              {user.fullName && <div className="text-xs opacity-70">{user.fullName}</div>}
              {user.followsYou && (
                <div className="text-xs text-blue-500 font-semibold">Follows you</div>
              )}
            </div>
          </div>
          {user.id !== currentUserId && (
            <Button
              variant={user.followed ? "contained" : "outlined"}
              color={user.followed ? "primary" : "inherit"}
              size="small"
              onClick={() => onFollowToggle(user)}
              sx={{
                borderRadius: "20px",
                minWidth: "90px",
                position: "static",
                paddingX: "1.5rem",
                paddingY: "0.5rem",
                bgcolor: user.followed
                  ? isDarkMode
                    ? "#000"
                    : "#000"
                  : isDarkMode
                  ? "#000"
                  : "#000",
                color: user.followed
                  ? isDarkMode
                    ? "#fff"
                    : "#fff"
                  : isDarkMode
                  ? "#fff"
                  : "#fff",
                border: user.followed ? "none" : `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              {user.followed ? "Following" : "Follow"}
            </Button>
          )}
        </article>
      ))}
    </section>
  );
};

export default UserSearchResult; 