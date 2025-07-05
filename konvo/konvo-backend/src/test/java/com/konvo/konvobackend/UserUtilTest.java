package com.konvo.konvobackend;

import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import util.UserUtil;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserUtilTest {

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = new User();
        user1.setId(1L);
        user1.setEmail("user1@example.com");
        user1.setUsername("user1");
        user1.setFollowers(new ArrayList<>());
        user1.setFollowings(new ArrayList<>());

        user2 = new User();
        user2.setId(2L);
        user2.setEmail("user2@example.com");
        user2.setUsername("user2");
        user2.setFollowers(new ArrayList<>());
        user2.setFollowings(new ArrayList<>());
    }

    @Test
    void testIsReqUser_SameUser() {
        boolean result = UserUtil.isReqUser(user1, user1);
        assertTrue(result);
    }

    @Test
    void testIsReqUser_DifferentUser() {
        boolean result = UserUtil.isReqUser(user1, user2);
        assertFalse(result);
    }

    @Test
    void testIsReqUser_NullUser() {
        assertThrows(NullPointerException.class, () -> {
            UserUtil.isReqUser(null, user1);
        });
    }

    @Test
    void testIsReqUser_NullReqUser() {
        assertThrows(NullPointerException.class, () -> {
            UserUtil.isReqUser(user1, null);
        });
    }

    @Test
    void testIsFollowedByReqUser_NotFollowed() {
        boolean result = UserUtil.isFollowedByReqUser(user1, user2);
        assertFalse(result);
    }

    @Test
    void testIsFollowedByReqUser_Followed() {
        List<User> followings = new ArrayList<>();
        followings.add(user2);
        user1.setFollowings(followings);
        
        boolean result = UserUtil.isFollowedByReqUser(user1, user2);
        assertTrue(result);
    }

    @Test
    void testIsFollowedByReqUser_NullUser() {
        assertThrows(NullPointerException.class, () -> {
            UserUtil.isFollowedByReqUser(null, user2);
        });
    }

    @Test
    void testIsFollowedByReqUser_NullReqUser() {
        boolean result = UserUtil.isFollowedByReqUser(user1, null);
        assertFalse(result);
    }

    @Test
    void testIsFollowedByReqUser_NullFollowers() {
        user2.setFollowers(null);
        boolean result = UserUtil.isFollowedByReqUser(user1, user2);
        assertFalse(result);
    }
} 