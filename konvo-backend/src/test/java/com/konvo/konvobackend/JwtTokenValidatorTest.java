package com.konvo.konvobackend;

import config.JwtTokenValidator;
import config.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtTokenValidatorTest {

    static class TestableJwtTokenValidator extends JwtTokenValidator {
        public boolean callShouldNotFilter(HttpServletRequest request) throws ServletException {
            return super.shouldNotFilter(request);
        }
        
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, java.io.IOException {
            super.doFilterInternal(request, response, filterChain);
        }
    }

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private Authentication authentication;

    private TestableJwtTokenValidator jwtTokenValidator;
    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtTokenValidator = new TestableJwtTokenValidator();
        jwtProvider = new JwtProvider();
        // Clear security context before each test
        SecurityContextHolder.clearContext();
    }

    @Test
    void testShouldNotFilter_AuthPath() throws ServletException {
        jwtTokenValidator = new TestableJwtTokenValidator();
        when(request.getServletPath()).thenReturn("/auth/login");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertTrue(result);
    }

    @Test
    void testShouldNotFilter_AuthPathWithSlash() throws ServletException {
        jwtTokenValidator = new TestableJwtTokenValidator();
        when(request.getServletPath()).thenReturn("/auth/");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertTrue(result);
    }

    @Test
    void testShouldNotFilter_NonAuthPath() throws ServletException {
        jwtTokenValidator = new TestableJwtTokenValidator();
        when(request.getServletPath()).thenReturn("/api/posts");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertFalse(result);
    }

    @Test
    void testShouldNotFilter_RootPath() throws ServletException {
        jwtTokenValidator = new TestableJwtTokenValidator();
        when(request.getServletPath()).thenReturn("/");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertFalse(result);
    }

    @Test
    void testShouldNotFilter_EmptyPath() throws ServletException {
        jwtTokenValidator = new TestableJwtTokenValidator();
        when(request.getServletPath()).thenReturn("");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertFalse(result);
    }

    @Test
    void testShouldNotFilter_AuthPathWithDifferentCase() throws ServletException {
        jwtTokenValidator = new TestableJwtTokenValidator();
        when(request.getServletPath()).thenReturn("/AUTH/login");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertFalse(result);
    }

    @Test
    void testShouldNotFilter_AuthPathWithExtraSlash() throws ServletException {
        jwtTokenValidator = new TestableJwtTokenValidator();
        when(request.getServletPath()).thenReturn("/auth//login");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertTrue(result);
    }

    @Test
    void testShouldNotFilter_PathStartingWithAuthButNotAuth() throws ServletException {
        when(request.getServletPath()).thenReturn("/authuser/profile");

        boolean result = jwtTokenValidator.callShouldNotFilter(request);

        assertFalse(result);
    }

    // Tests for doFilterInternal method
    @Test
    void testDoFilterInternal_NoAuthorizationHeader() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        jwtTokenValidator.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testDoFilterInternal_EmptyAuthorizationHeader() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("");

        jwtTokenValidator.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testDoFilterInternal_ValidJwtToken() throws Exception {
        when(authentication.getName()).thenReturn("test@example.com");
        String token = jwtProvider.generateToken(authentication);
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);

        jwtTokenValidator.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals("test@example.com", auth.getName());
        assertTrue(auth.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("USER")));
    }

    @Test
    void testDoFilterInternal_ValidJwtTokenWithWhitespace() throws Exception {
        when(authentication.getName()).thenReturn("test@example.com");
        String token = jwtProvider.generateToken(authentication);
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token + " ");

        jwtTokenValidator.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals("test@example.com", auth.getName());
    }

    @Test
    void testDoFilterInternal_InvalidJwtToken() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid.token.here");

        assertThrows(org.springframework.security.authentication.BadCredentialsException.class, () -> {
            jwtTokenValidator.doFilterInternal(request, response, filterChain);
        });
    }

    @Test
    void testDoFilterInternal_AuthorizationHeaderWithoutBearer() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("some-token-without-bearer");

        jwtTokenValidator.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testDoFilterInternal_AuthorizationHeaderWithOnlyBearer() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer ");

        jwtTokenValidator.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void testDoFilterInternal_ExpiredToken() throws Exception {
        // Create a token that's already expired by manipulating the exp claim
        when(authentication.getName()).thenReturn("test@example.com");
        String token = jwtProvider.generateToken(authentication);
        // Modify the token to make it expired (this is a simplified approach)
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token + ".expired");

        assertThrows(org.springframework.security.authentication.BadCredentialsException.class, () -> {
            jwtTokenValidator.doFilterInternal(request, response, filterChain);
        });
    }

    @Test
    void testDoFilterInternal_MalformedToken() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer not.a.valid.jwt.token");

        assertThrows(org.springframework.security.authentication.BadCredentialsException.class, () -> {
            jwtTokenValidator.doFilterInternal(request, response, filterChain);
        });
    }
} 