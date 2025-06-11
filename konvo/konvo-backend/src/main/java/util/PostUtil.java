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
        for(User user : post.getRepostUser()) {
            if(user.getId().equals(reqUser.getId())) {
                return true;
            }
        }

        return false;
    }
}
