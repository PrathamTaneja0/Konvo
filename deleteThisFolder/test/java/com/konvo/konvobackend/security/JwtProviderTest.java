package com.konvo.konvobackend.security;

import com.konvo.konvobackend.config.JwtProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;

class JwtProviderTest {
    @Test
    @DisplayName("generateToken and getEmailFromToken should work for valid input")
    void generateAndExtractEmail() {
        JwtProvider jwtProvider = new JwtProvider();
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn("testuser@mail.com");
        String token = jwtProvider.generateToken(auth);
        assertNotNull(token);
        String email = jwtProvider.getEmailFromToken(token);
        assertEquals("testuser@mail.com", email);
    }
} 