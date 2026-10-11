package com.konvo.konvobackend;

import controller.UserController;
import dto.UserDto;
import dto_mapper.UserDtoMapper;
import exception.UserException;
import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import service.UserService;
import util.UserUtil;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User user;
    private UserDto userDto;
    private String jwt;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setFullName("Test User");
        user.setFollowers(new ArrayList<>());
        user.setFollowings(new ArrayList<>());
        
        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("test@example.com");
        userDto.setUsername("testuser");
        userDto.setFullName("Test User");
        
        jwt = "mock-jwt";
    }

    @Test
    void testGetUserProfile_Success() throws UserException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        try (MockedStatic<UserDtoMapper> mocked = mockStatic(UserDtoMapper.class)) {
            mocked.when(() -> UserDtoMapper.toUserDto(any(User.class))).thenReturn(userDto);
            ResponseEntity<UserDto> response = userController.getUserProfile(jwt);
            assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().isReq_user());
        }
    }

    @Test
    void testGetUserById_Success() throws UserException {
        User targetUser = new User();
        targetUser.setId(2L);
        targetUser.setEmail("target@example.com");
        targetUser.setUsername("targetuser");
        targetUser.setFollowers(new ArrayList<>());
        targetUser.setFollowings(new ArrayList<>());
        
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(userService.findUserById(2L)).thenReturn(targetUser);
        
        try (MockedStatic<UserDtoMapper> mocked = mockStatic(UserDtoMapper.class);
             MockedStatic<UserUtil> utilMocked = mockStatic(UserUtil.class)) {
            mocked.when(() -> UserDtoMapper.toUserDto(any(User.class))).thenReturn(userDto);
            utilMocked.when(() -> UserUtil.isReqUser(any(User.class), any(User.class))).thenReturn(false);
            utilMocked.when(() -> UserUtil.isFollowedByReqUser(any(User.class), any(User.class))).thenReturn(false);
            
            ResponseEntity<UserDto> response = userController.getUserById(2L, jwt);
            assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isReq_user());
            assertFalse(response.getBody().isFollowed());
        }
    }

    @Test
    void testSearchUsers_Success() throws UserException {
        List<User> users = new ArrayList<>();
        users.add(user);
        
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(userService.searchUser("test")).thenReturn(users);
        
        try (MockedStatic<UserDtoMapper> mocked = mockStatic(UserDtoMapper.class);
             MockedStatic<UserUtil> utilMocked = mockStatic(UserUtil.class)) {
            List<UserDto> userDtos = new ArrayList<>();
            userDtos.add(userDto);
            mocked.when(() -> UserDtoMapper.toUserDtos(anyList())).thenReturn(userDtos);
            utilMocked.when(() -> UserUtil.isFollowedByReqUser(any(User.class), any(User.class))).thenReturn(false);
            
            ResponseEntity<List<UserDto>> response = userController.searchUsers("test", jwt);
            assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isEmpty());
        }
    }

    @Test
    void testUpdateUser_Success() throws UserException {
        User updateRequest = new User();
        updateRequest.setFullName("Updated Name");
        
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(userService.updateUser(user.getId(), updateRequest)).thenReturn(user);
        
        try (MockedStatic<UserDtoMapper> mocked = mockStatic(UserDtoMapper.class)) {
            mocked.when(() -> UserDtoMapper.toUserDto(any(User.class))).thenReturn(userDto);
            ResponseEntity<UserDto> response = userController.updateUser(updateRequest, jwt);
            assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
            assertNotNull(response.getBody());
        }
    }

    @Test
    void testFollowUser_Success() throws UserException {
        User targetUser = new User();
        targetUser.setId(2L);
        targetUser.setEmail("target@example.com");
        targetUser.setUsername("targetuser");
        targetUser.setFollowers(new ArrayList<>());
        targetUser.setFollowings(new ArrayList<>());
        
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(userService.followUser(2L, user)).thenReturn(targetUser);
        
        try (MockedStatic<UserDtoMapper> mocked = mockStatic(UserDtoMapper.class);
             MockedStatic<UserUtil> utilMocked = mockStatic(UserUtil.class)) {
            mocked.when(() -> UserDtoMapper.toUserDto(any(User.class))).thenReturn(userDto);
            utilMocked.when(() -> UserUtil.isFollowedByReqUser(any(User.class), any(User.class))).thenReturn(true);
            
            ResponseEntity<UserDto> response = userController.followUser(2L, jwt);
            assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().isFollowed());
        }
    }

    @Test
    void testGetUserFollowers_Success() throws UserException {
        User targetUser = new User();
        targetUser.setId(2L);
        targetUser.setFollowers(new ArrayList<>());
        
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(userService.findUserById(2L)).thenReturn(targetUser);
        
        try (MockedStatic<UserDtoMapper> mocked = mockStatic(UserDtoMapper.class)) {
            List<UserDto> followerDtos = new ArrayList<>();
            mocked.when(() -> UserDtoMapper.toUserDtos(anyList())).thenReturn(followerDtos);
            
            ResponseEntity<List<UserDto>> response = userController.getUserFollowers(2L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
        }
    }

    @Test
    void testGetUserFollowings_Success() throws UserException {
        User targetUser = new User();
        targetUser.setId(2L);
        targetUser.setFollowings(new ArrayList<>());
        
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(userService.findUserById(2L)).thenReturn(targetUser);
        
        try (MockedStatic<UserDtoMapper> mocked = mockStatic(UserDtoMapper.class)) {
            List<UserDto> followingDtos = new ArrayList<>();
            mocked.when(() -> UserDtoMapper.toUserDtos(anyList())).thenReturn(followingDtos);
            
            ResponseEntity<List<UserDto>> response = userController.getUserFollowings(2L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
        }
    }
} 