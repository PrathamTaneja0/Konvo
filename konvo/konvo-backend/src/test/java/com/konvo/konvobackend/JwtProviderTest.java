package com.konvo.konvobackend;

import config.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtProviderTest {

    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider();
    }

    @Test
    void testGenerateToken_Success() {
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testuser");
        
        String token = jwtProvider.generateToken(authentication);
        
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGetEmailFromToken_Success() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");
        
        String token = jwtProvider.generateToken(authentication);
        String email = jwtProvider.getEmailFromToken(token);
        
        assertEquals("test@example.com", email);
    }

    @Test
    void testGetEmailFromToken_WithBearerPrefix() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");
        
        String token = jwtProvider.generateToken(authentication);
        String email = jwtProvider.getEmailFromToken("Bearer " + token);
        
        assertEquals("test@example.com", email);
    }

    @Test
    void testGetEmailFromToken_WithWhitespace() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");
        
        String token = jwtProvider.generateToken(authentication);
        String email = jwtProvider.getEmailFromToken("Bearer " + token + " ");
        
        assertEquals("test@example.com", email);
    }

    @Test
    void testGetEmailFromToken_NullToken() {
        assertThrows(Exception.class, () -> {
            jwtProvider.getEmailFromToken(null);
        });
    }
} 