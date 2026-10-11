package com.konvo.konvobackend;

import config.JwtConstant;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtConstantTest {

    @Test
    void testSecretKey_NotNull() {
        assertNotNull(JwtConstant.SECRET_KEY);
        assertFalse(JwtConstant.SECRET_KEY.isEmpty());
    }

    @Test
    void testSecretKey_Length() {
        // The secret key should be a valid hex string with reasonable length
        assertTrue(JwtConstant.SECRET_KEY.length() >= 32);
        assertTrue(JwtConstant.SECRET_KEY.length() <= 128);
    }

    @Test
    void testSecretKey_HexFormat() {
        // Check if the secret key is a valid hex string
        String hexPattern = "^[0-9A-Fa-f]+$";
        assertTrue(JwtConstant.SECRET_KEY.matches(hexPattern), 
            "SECRET_KEY should be a valid hex string");
    }

    @Test
    void testJwtHeader_NotNull() {
        assertNotNull(JwtConstant.JWT_HEADER);
        assertFalse(JwtConstant.JWT_HEADER.isEmpty());
    }

    @Test
    void testJwtHeader_Value() {
        assertEquals("Authorization", JwtConstant.JWT_HEADER);
    }

    @Test
    void testConstants_ArePublic() {
        // Test that constants are accessible (public static final)
        assertDoesNotThrow(() -> {
            JwtConstant.SECRET_KEY.toString();
            JwtConstant.JWT_HEADER.toString();
        });
    }

    @Test
    void testConstants_AreFinal() throws NoSuchFieldException {
        // Test that constants are final (immutable)
        assertTrue(JwtConstant.class.getDeclaredField("SECRET_KEY").getModifiers() 
            == (java.lang.reflect.Modifier.PUBLIC | java.lang.reflect.Modifier.STATIC | java.lang.reflect.Modifier.FINAL));
        assertTrue(JwtConstant.class.getDeclaredField("JWT_HEADER").getModifiers() 
            == (java.lang.reflect.Modifier.PUBLIC | java.lang.reflect.Modifier.STATIC | java.lang.reflect.Modifier.FINAL));
    }

    @Test
    void testClassInstantiation() {
        // Test that the class can be instantiated (covers the default constructor)
        JwtConstant jwtConstant = new JwtConstant();
        assertNotNull(jwtConstant);
    }
} 