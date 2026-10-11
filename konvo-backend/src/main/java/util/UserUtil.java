package util;

import model.User;

public class UserUtil {
    public static final boolean isReqUser(User reqUser, User user2)
    {
        if (reqUser == null || user2 == null) {
            return false;
        }
        return reqUser.getId().equals(user2.getId());
    }
    public static final boolean isFollowedByReqUser(User reqUser, User user2) {
        if (reqUser == null || user2 == null || reqUser.getFollowings() == null) {
            return false;
        }
        return reqUser.getFollowings().contains(user2);
    }
}
