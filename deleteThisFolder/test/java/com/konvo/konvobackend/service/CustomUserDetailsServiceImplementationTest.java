package com.konvo.konvobackend.service;

import com.konvo.konvobackend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.konvo.konvobackend.repository.UserRepository;
import com.konvo.konvobackend.service.CustomUserDetailsServiceImplementation;

import java.util.Optional;
import org.mockito.stubbing.OngoingStubbing;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.mockito.Mockito;

class CustomUserDetailsServiceImplementationTest {
    private UserRepository userRepository;
    @InjectMocks
    private CustomUserDetailsServiceImplementation customUserDetailsService;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        customUserDetailsService = new CustomUserDetailsServiceImplementation(userRepository);
    }

    @Test
    @DisplayName("loadUserByUsername should return user if exists")
    void loadUserByUsername_success() {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("testuser@mail.com");
        user.setPassword("password");
        when(userRepository.findByEmail(anyString())).thenReturn(user);
        assertNotNull(customUserDetailsService.loadUserByUsername("testuser@mail.com"));
    }

    @Test
    @DisplayName("loadUserByUsername should throw if not found")
    void loadUserByUsername_notFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(null);
        assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername("nouser@mail.com"));
    }
} 