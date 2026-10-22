package com.konvo.konvobackend;

import config.JwtConstant;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtConstantTest {

    @Test
    void testJwtHeader_Value() {
        assertEquals("Authorization", JwtConstant.JWT_HEADER);
    }

    @Test
    void testJwtHeader_IsConstant() throws NoSuchFieldException {
        assertEquals(java.lang.reflect.Modifier.PUBLIC | java.lang.reflect.Modifier.STATIC | java.lang.reflect.Modifier.FINAL,
            JwtConstant.class.getDeclaredField("JWT_HEADER").getModifiers());
    }

    @Test
    void testSigningSecret_IsNotHardcoded() {
        // The secret must come from configuration (KONVO_JWT_SECRET), never from source code.
        assertThrows(NoSuchFieldException.class, () -> JwtConstant.class.getDeclaredField("SECRET_KEY"));
    }

    @Test
    void testClassInstantiation() {
        assertNotNull(new JwtConstant());
    }
}
