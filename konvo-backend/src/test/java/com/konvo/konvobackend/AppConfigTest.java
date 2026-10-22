package com.konvo.konvobackend;

import config.AppConfig;
import config.JwtTokenValidator;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class AppConfigTest {

    @Mock
    private HttpServletRequest request;

    private AppConfig appConfig = new AppConfig();

    @Test
    void testPasswordEncoder_NotNull() {
        PasswordEncoder passwordEncoder = appConfig.passwordEncoder();
        
        assertNotNull(passwordEncoder);
    }

    @Test
    void testPasswordEncoder_IsBCrypt() {
        PasswordEncoder passwordEncoder = appConfig.passwordEncoder();
        
        // Test that it's actually a BCryptPasswordEncoder
        assertTrue(passwordEncoder.matches("password", 
            passwordEncoder.encode("password")));
    }

    @Test
    void testPasswordEncoder_DifferentPasswords() {
        PasswordEncoder passwordEncoder = appConfig.passwordEncoder();
        
        String encodedPassword = passwordEncoder.encode("password");
        assertFalse(passwordEncoder.matches("different", encodedPassword));
    }

    @Test
    void testJwtTokenValidator_NotNull() {
        JwtTokenValidator jwtTokenValidator = appConfig.jwtTokenValidator(JwtProviderTest.testProvider());
        
        assertNotNull(jwtTokenValidator);
    }

    @Test
    void testJwtTokenValidator_IsInstanceOf() {
        JwtTokenValidator jwtTokenValidator = appConfig.jwtTokenValidator(JwtProviderTest.testProvider());
        
        assertTrue(jwtTokenValidator instanceof JwtTokenValidator);
    }

    @Test
    void testCorsConfigurationSource_NotNull() {
        CorsConfigurationSource corsConfigurationSource = appConfig.corsConfigurationSource();
        assertNotNull(corsConfigurationSource);
    }

    @Test
    void testCorsConfigurationSource_IsUrlBased() {
        CorsConfigurationSource corsConfigurationSource = appConfig.corsConfigurationSource();
        assertTrue(corsConfigurationSource instanceof org.springframework.web.cors.UrlBasedCorsConfigurationSource);
    }

    @Test
    void testAppConfig_ClassAnnotations() {
        Class<?> configClass = AppConfig.class;
        
        assertTrue(configClass.isAnnotationPresent(org.springframework.context.annotation.Configuration.class));
        assertTrue(configClass.isAnnotationPresent(org.springframework.security.config.annotation.web.configuration.EnableWebSecurity.class));
    }

    @Test
    void testAppConfig_BeanMethods() {
        assertDoesNotThrow(() -> {
            appConfig.passwordEncoder();
            appConfig.jwtTokenValidator(JwtProviderTest.testProvider());
            appConfig.corsConfigurationSource();
        });
    }
} 