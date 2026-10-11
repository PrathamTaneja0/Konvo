package com.konvo.konvobackend;

import controller.AuthController;
import model.User;
import repository.UserRepository;
import response.AuthResponse;
import response.ApiResponse;
import service.UserService;
import config.JwtProvider;
import service.CustomUserDetailsServiceImplementation;
import exception.UserException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private CustomUserDetailsServiceImplementation customUserDetails;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private User savedUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setFullName("Test User");
        testUser.setBirthDate("1990-01-01");
        testUser.setUsername("testuser");

        savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail("test@example.com");
        savedUser.setPassword("encodedPassword");
        savedUser.setFullName("Test User");
        savedUser.setBirthDate("1990-01-01");
        savedUser.setUsername("testuser");
    }

    @Test
    void testSignup_Success() throws Exception {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(null);
        doNothing().when(userService).validateUsername(testUser.getUsername());
        when(passwordEncoder.encode(testUser.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtProvider.generateToken(any(Authentication.class))).thenReturn("jwt-token");

        // Act
        ResponseEntity<AuthResponse> response = authController.createUserHandler(testUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isStatus());
        assertEquals("jwt-token", response.getBody().getJwt());
        assertEquals("testuser", response.getBody().getUser().getUsername());

        verify(userRepository).findByEmail(testUser.getEmail());
        verify(userService).validateUsername(testUser.getUsername());
        verify(passwordEncoder).encode(testUser.getPassword());
        verify(userRepository).save(any(User.class));
        verify(jwtProvider).generateToken(any(Authentication.class));
    }

    @Test
    void testSignup_EmailAlreadyExists() throws UserException {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(savedUser);

        // Act & Assert
        assertThrows(UserException.class, () -> {
            authController.createUserHandler(testUser);
        });

        verify(userRepository).findByEmail(testUser.getEmail());
        verify(userService, never()).validateUsername(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testSignin_Success() {
        // Arrange
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getPassword()).thenReturn("encodedPassword");
        when(userDetails.getAuthorities()).thenReturn(null);
        
        when(customUserDetails.loadUserByUsername(testUser.getEmail())).thenReturn(userDetails);
        when(passwordEncoder.matches(testUser.getPassword(), userDetails.getPassword())).thenReturn(true);
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(savedUser);
        when(jwtProvider.generateToken(any(Authentication.class))).thenReturn("jwt-token");

        // Act
        ResponseEntity<AuthResponse> response = authController.signinUserHandler(testUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isStatus());
        assertEquals("jwt-token", response.getBody().getJwt());

        verify(customUserDetails).loadUserByUsername(testUser.getEmail());
        verify(passwordEncoder).matches(testUser.getPassword(), userDetails.getPassword());
        verify(userRepository).findByEmail(testUser.getEmail());
        verify(jwtProvider).generateToken(any(Authentication.class));
    }

    @Test
    void testSignin_InvalidUsername() {
        // Arrange
        when(customUserDetails.loadUserByUsername(testUser.getEmail())).thenReturn(null);

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> {
            authController.signinUserHandler(testUser);
        });

        verify(customUserDetails).loadUserByUsername(testUser.getEmail());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void testSignin_InvalidPassword() {
        // Arrange
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getPassword()).thenReturn("encodedPassword");
        
        when(customUserDetails.loadUserByUsername(testUser.getEmail())).thenReturn(userDetails);
        when(passwordEncoder.matches(testUser.getPassword(), userDetails.getPassword())).thenReturn(false);

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> {
            authController.signinUserHandler(testUser);
        });

        verify(customUserDetails).loadUserByUsername(testUser.getEmail());
        verify(passwordEncoder).matches(testUser.getPassword(), userDetails.getPassword());
    }

    @Test
    void testCheckUsernameAvailability_Available() {
        // Arrange
        when(userService.isUsernameAvailable("newuser")).thenReturn(true);

        // Act
        ResponseEntity<ApiResponse> response = authController.checkUsernameAvailability("newuser");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isStatus());
        assertEquals("Username is available", response.getBody().getMessage());

        verify(userService).isUsernameAvailable("newuser");
    }

    @Test
    void testCheckUsernameAvailability_NotAvailable() {
        // Arrange
        when(userService.isUsernameAvailable("existinguser")).thenReturn(false);

        // Act
        ResponseEntity<ApiResponse> response = authController.checkUsernameAvailability("existinguser");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isStatus());
        assertEquals("Username is already taken", response.getBody().getMessage());

        verify(userService).isUsernameAvailable("existinguser");
    }

    @Test
    void testCheckEmailAvailability_Available() {
        // Arrange
        when(userRepository.findByEmail("new@example.com")).thenReturn(null);

        // Act
        ResponseEntity<ApiResponse> response = authController.checkEmailAvailability("new@example.com");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isStatus());
        assertEquals("Email is available", response.getBody().getMessage());

        verify(userRepository).findByEmail("new@example.com");
    }

    @Test
    void testCheckEmailAvailability_NotAvailable() {
        // Arrange
        when(userRepository.findByEmail("existing@example.com")).thenReturn(savedUser);

        // Act
        ResponseEntity<ApiResponse> response = authController.checkEmailAvailability("existing@example.com");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isStatus());
        assertEquals("Email is already registered", response.getBody().getMessage());

        verify(userRepository).findByEmail("existing@example.com");
    }
}

// Prompt: "How do I write integration tests for authentication endpoints?"
// Prompt: "The JWT token tests are failing. How can I debug this?"
// Prompt: "How do I mock external dependencies in unit tests?" 