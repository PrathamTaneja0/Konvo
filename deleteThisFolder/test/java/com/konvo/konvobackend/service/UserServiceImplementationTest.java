package com.konvo.konvobackend.service;

import com.konvo.konvobackend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.konvo.konvobackend.repository.UserRepository;
import com.konvo.konvobackend.service.UserServiceImplementation;
import com.konvo.konvobackend.exception.UserException;

import java.util.Optional;
import java.util.Collections;
import java.util.List;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.konvo.konvobackend.config.JwtProvider;
import org.springframework.core.env.Environment;

class UserServiceImplementationTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserServiceImplementation userService;
    @Mock
    private Environment environment;
    @Mock
    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        userService = new UserServiceImplementation();
        Field repoField = UserServiceImplementation.class.getDeclaredField("userRepository");
        repoField.setAccessible(true);
        repoField.set(userService, userRepository);
        Field envField = UserServiceImplementation.class.getDeclaredField("environment");
        envField.setAccessible(true);
        envField.set(userService, environment);
        Field jwtField = UserServiceImplementation.class.getDeclaredField("jwtProvider");
        jwtField.setAccessible(true);
        jwtField.set(userService, jwtProvider);
    }

    @Test
    @DisplayName("findUserById should return user if exists")
    void findUserById_success() throws Exception {
        User user = new User();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        assertEquals(user, userService.findUserById(1L));
    }

    @Test
    @DisplayName("findUserById should throw if not found")
    void findUserById_notFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(UserException.class, () -> userService.findUserById(1L));
    }

    @Test
    @DisplayName("findUserProfileByJwt should throw if not found")
    void findUserProfileByJwt_notFound() {
        when(environment.getActiveProfiles()).thenReturn(new String[] {"prod"});
        when(jwtProvider.getEmailFromToken(anyString())).thenReturn("nouser@mail.com");
        when(userRepository.findByEmail("nouser@mail.com")).thenReturn(null);
        assertThrows(UserException.class, () -> userService.findUserProfileByJwt("jwt"));
    }

    @Test
    @DisplayName("updateUser should update fields")
    void updateUser_success() throws Exception {
        User user = new User();
        user.setFullName("old");
        User req = new User();
        req.setFullName("new");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        User result = userService.updateUser(1L, req);
        assertEquals("new", result.getFullName());
    }

    @Test
    @DisplayName("updateUser should only update non-null fields")
    void updateUser_onlyNonNull() throws Exception {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        User req = new User();
        req.setFullName("New Name");
        userService.updateUser(1L, req);
        verify(userRepository).save(user);
        assertEquals("New Name", user.getFullName());
    }

    @Test
    @DisplayName("followUser should add following")
    void followUser_success() throws Exception {
        User user = new User();
        user.setId(2L);
        user.setFollowings(new java.util.ArrayList<>());
        User toFollow = new User();
        toFollow.setId(1L);
        toFollow.setFollowers(new java.util.ArrayList<>());
        when(userRepository.findById(1L)).thenReturn(Optional.of(toFollow));
        when(userRepository.save(any(User.class))).thenReturn(user);
        User result = userService.followUser(1L, user);
        assertEquals(toFollow, result);
    }

    @Test
    @DisplayName("followUser should handle already following and unfollow")
    void followUser_alreadyFollowing() throws Exception {
        User user = new User();
        user.setId(1L);
        User followTo = new User();
        followTo.setId(2L);
        user.setFollowings(new java.util.ArrayList<>(List.of(followTo)));
        followTo.setFollowers(new java.util.ArrayList<>(List.of(user)));
        when(userRepository.findById(2L)).thenReturn(Optional.of(followTo));
        userService.followUser(2L, user);
        verify(userRepository).save(user);
        verify(userRepository).save(followTo);
        assertFalse(followTo.getFollowers().contains(user));
        assertFalse(user.getFollowings().contains(followTo));
    }

    @Test
    @DisplayName("followUser should handle not following and follow")
    void followUser_notFollowing() throws Exception {
        User user = new User();
        user.setId(1L);
        User followTo = new User();
        followTo.setId(2L);
        user.setFollowings(new java.util.ArrayList<>());
        followTo.setFollowers(new java.util.ArrayList<>());
        when(userRepository.findById(2L)).thenReturn(Optional.of(followTo));
        userService.followUser(2L, user);
        verify(userRepository).save(user);
        verify(userRepository).save(followTo);
        assertTrue(followTo.getFollowers().contains(user));
        assertTrue(user.getFollowings().contains(followTo));
    }

    @Test
    @DisplayName("searchUser should return list")
    void searchUser_success() {
        when(userRepository.searchUser("q")).thenReturn(Collections.emptyList());
        assertNotNull(userService.searchUser("q"));
    }

    @Test
    @DisplayName("isUsernameAvailable should return true if available")
    void isUsernameAvailable_true() {
        when(userRepository.findByUsername("abc")).thenReturn(null);
        assertTrue(userService.isUsernameAvailable("abc"));
    }

    @Test
    @DisplayName("isUsernameAvailable should return false if username exists")
    void isUsernameAvailable_false() {
        User user = new User();
        user.setUsername("taken");
        when(userRepository.findByUsername("taken")).thenReturn(Optional.of(user));
        assertFalse(userService.isUsernameAvailable("taken"));
    }

    @Test
    @DisplayName("isUsernameAvailable should return false for null/empty")
    void isUsernameAvailable_nullOrEmpty() {
        assertFalse(userService.isUsernameAvailable(null));
        assertFalse(userService.isUsernameAvailable("   "));
    }

    @Test
    @DisplayName("validateUsername should throw for null, too short, too long, invalid chars, taken")
    void validateUsername_invalidCases() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        assertThrows(UserException.class, () -> userService.validateUsername(null));
        assertThrows(UserException.class, () -> userService.validateUsername("ab"));
        assertThrows(UserException.class, () -> userService.validateUsername("a".repeat(31)));
        assertThrows(UserException.class, () -> userService.validateUsername("invalid!"));
        when(userRepository.findByUsername("taken")).thenReturn(Optional.of(new User()));
        assertThrows(UserException.class, () -> userService.validateUsername("taken"));
    }
} f