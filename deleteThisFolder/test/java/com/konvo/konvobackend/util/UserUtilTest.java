package com.konvo.konvobackend.util;

import com.konvo.konvobackend.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import util.UserUtil;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class UserUtilTest {
    @Test
    @DisplayName("isReqUser should return true if IDs match")
    void isReqUser_true() {
        User u1 = new User();
        u1.setId(1L);
        User u2 = new User();
        u2.setId(1L);
        assertTrue(UserUtil.isReqUser(u1, u2));
    }

    @Test
    @DisplayName("isReqUser should return false if IDs do not match")
    void isReqUser_false() {
        User u1 = new User();
        u1.setId(1L);
        User u2 = new User();
        u2.setId(2L);
        assertFalse(UserUtil.isReqUser(u1, u2));
    }

    @Test
    @DisplayName("isFollowedByReqUser should return true if user2 is in reqUser's followings")
    void isFollowedByReqUser_true() {
        User reqUser = new User();
        reqUser.setId(1L);
        User followed = new User();
        followed.setId(2L);
        reqUser.setFollowings(new ArrayList<>());
        reqUser.getFollowings().add(followed);
        assertTrue(UserUtil.isFollowedByReqUser(reqUser, followed));
    }

    @Test
    @DisplayName("isFollowedByReqUser should return false if user2 is not in reqUser's followings")
    void isFollowedByReqUser_false() {
        User reqUser = new User();
        reqUser.setId(1L);
        User notFollowed = new User();
        notFollowed.setId(3L);
        reqUser.setFollowings(new ArrayList<>());
        assertFalse(UserUtil.isFollowedByReqUser(reqUser, notFollowed));
    }
} 