package util;

import model.Like;
import model.Post;
import model.User;

public class PostUtil {


    public static boolean isLikedByReqUser(User reqUser, Post post) {
        for (Like like : post.getLikes()) {
            if (like.getUser().getId().equals(reqUser.getId())) {
                return true;
            }
        }
        return false;
    }


    public static boolean isRepostedByReqUser(User reqUser, Post post) {
        // Check if the user has any repost of the original post (not just authored the current repost)
        if (post.getRepostUser() != null) {
            for (User user : post.getRepostUser()) {
                if (user.getId().equals(reqUser.getId())) {
                    return true;
                }
            }
        }
        return false;
    }
}
