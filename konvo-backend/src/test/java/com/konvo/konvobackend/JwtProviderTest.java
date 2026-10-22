package com.konvo.konvobackend;

import config.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtProviderTest {

    /** Test-only signing secret; real deployments read KONVO_JWT_SECRET from the environment. */
    static final String TEST_SECRET = "test-only-jwt-secret-not-used-outside-unit-tests";

    static JwtProvider testProvider() {
        return new JwtProvider(TEST_SECRET);
    }

    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtProvider = testProvider();
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
    @Test
    void testMissingSecret_FailsFast() {
        IllegalStateException e = assertThrows(IllegalStateException.class, () -> new JwtProvider(""));
        assertTrue(e.getMessage().contains("KONVO_JWT_SECRET is not set"));
        assertThrows(IllegalStateException.class, () -> new JwtProvider(null));
    }

    @Test
    void testShortSecret_IsRejected() {
        IllegalStateException e = assertThrows(IllegalStateException.class, () -> new JwtProvider("too-short"));
        assertTrue(e.getMessage().contains("too short"));
    }

    @Test
    void testTokenFromAnotherSecret_IsRejected() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");
        String foreign = new JwtProvider(TEST_SECRET + "-other").generateToken(authentication);
        assertThrows(Exception.class, () -> jwtProvider.getEmailFromToken(foreign));
    }

} 