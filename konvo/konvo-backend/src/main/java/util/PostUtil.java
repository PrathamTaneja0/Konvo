package util;

import model.Like;
import model.Post;
import model.User;

public class PostUtil {


    public static boolean isLikedByReqUser(User reqUser, Post post) {
        for(Like like:)
        return null;
    }


    public static boolean isRepostedByReqUser(User reqUser, Post post) {
        if (reqUser == null || post == null) {
            return false;
        }

        return post.getRepostUser().contains(reqUser);
    }
}
