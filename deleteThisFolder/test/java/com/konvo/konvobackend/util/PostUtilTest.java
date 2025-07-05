package com.konvo.konvobackend.util;

import com.konvo.konvobackend.model.Like;
import com.konvo.konvobackend.model.Post;
import com.konvo.konvobackend.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import util.PostUtil;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class PostUtilTest {
    @Test
    @DisplayName("isLikedByReqUser should return true if user liked the post")
    void isLikedByReqUser_true() {
        User user = new User();
        user.setId(1L);
        Post post = new Post();
        post.setLikes(new ArrayList<>());
        Like like = new Like();
        like.setUser(user);
        post.getLikes().add(like);
        assertTrue(PostUtil.isLikedByReqUser(user, post));
    }

    @Test
    @DisplayName("isLikedByReqUser should return false if user did not like the post")
    void isLikedByReqUser_false() {
        User user = new User();
        user.setId(1L);
        Post post = new Post();
        post.setLikes(new ArrayList<>());
        assertFalse(PostUtil.isLikedByReqUser(user, post));
    }

    @Test
    @DisplayName("isRepostedByReqUser should return true if user is in repostUser list")
    void isRepostedByReqUser_true() {
        User user = new User();
        user.setId(1L);
        Post post = new Post();
        post.setRepostUser(new ArrayList<>());
        post.getRepostUser().add(user);
        assertTrue(PostUtil.isRepostedByReqUser(user, post));
    }

    @Test
    @DisplayName("isRepostedByReqUser should return false if user is not in repostUser list")
    void isRepostedByReqUser_false() {
        User user = new User();
        user.setId(1L);
        Post post = new Post();
        post.setRepostUser(new ArrayList<>());
        assertFalse(PostUtil.isRepostedByReqUser(user, post));
    }
} 