package com.konvo.konvobackend;

import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import repository.UserRepository;
import service.UserServiceImplementation;
import config.JwtProvider;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserServiceImplementation userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtProvider jwtProvider;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setPassword("password");
        testUser.setFullName("Test User");
        testUser.setFollowers(new ArrayList<>());
        testUser.setFollowings(new ArrayList<>());
    }

    @Test
    void testFindUserProfileByJwt_Success() throws Exception {
        // Mock JWT token parsing
        when(jwtProvider.getEmailFromToken("valid-jwt")).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(testUser);
        
        User result = userService.findUserProfileByJwt("valid-jwt");
        
        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getUsername(), result.getUsername());
    }

    @Test
    void testFindUserProfileByJwt_UserNotFound() {
        when(jwtProvider.getEmailFromToken("invalid-jwt")).thenReturn("nonexistent@example.com");
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(null);
        
        assertThrows(Exception.class, () -> {
            userService.findUserProfileByJwt("invalid-jwt");
        });
    }

    @Test
    void testFindUserById_Success() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        User result = userService.findUserById(1L);
        
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
    }

    @Test
    void testFindUserById_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(Exception.class, () -> {
            userService.findUserById(1L);
        });
    }

    @Test
    void testSearchUser_Success() throws Exception {
        List<User> users = new ArrayList<>();
        users.add(testUser);
        when(userRepository.searchUser(anyString())).thenReturn(users);
        
        List<User> result = userService.searchUser("test");
        
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        User updateRequest = new User();
        updateRequest.setFullName("Updated Name");
        
        User result = userService.updateUser(1L, updateRequest);
        
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testFollowUser_Success() throws Exception {
        User targetUser = new User();
        targetUser.setId(2L);
        targetUser.setFollowers(new ArrayList<>());
        
        when(userRepository.findById(2L)).thenReturn(Optional.of(targetUser));
        when(userRepository.save(any(User.class))).thenReturn(targetUser);
        
        User result = userService.followUser(2L, testUser);
        
        assertNotNull(result);
        verify(userRepository, times(2)).save(any(User.class));
    }

    @Test
    void testIsUsernameAvailable_Available() {
        when(userRepository.findByUsername("newuser")).thenReturn(null);
        
        boolean result = userService.isUsernameAvailable("newuser");
        
        assertTrue(result);
    }

    @Test
    void testIsUsernameAvailable_NotAvailable() {
        when(userRepository.findByUsername("existinguser")).thenReturn(testUser);
        
        boolean result = userService.isUsernameAvailable("existinguser");
        
        assertFalse(result);
    }

    @Test
    void testValidateUsername_Valid() throws Exception {
        assertDoesNotThrow(() -> {
            userService.validateUsername("valid_username123");
        });
    }

    @Test
    void testValidateUsername_Invalid() {
        assertThrows(Exception.class, () -> {
            userService.validateUsername("a"); // too short
        });
    }
} 