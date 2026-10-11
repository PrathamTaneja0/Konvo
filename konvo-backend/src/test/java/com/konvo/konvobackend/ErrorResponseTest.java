package com.konvo.konvobackend;

import org.junit.jupiter.api.Test;
import response.ErrorResponse;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ErrorResponseTest {
    @Test
    void testConstructorsAndGettersSetters() {
        // Default constructor
        ErrorResponse er1 = new ErrorResponse();
        assertNotNull(er1.getTimestamp());

        // Constructor with code and message
        ErrorResponse er2 = new ErrorResponse("CODE", "Message");
        assertEquals("CODE", er2.getCode());
        assertEquals("Message", er2.getMessage());

        // Constructor with code, message, path
        ErrorResponse er3 = new ErrorResponse("C2", "Msg2", "/path");
        assertEquals("C2", er3.getCode());
        assertEquals("Msg2", er3.getMessage());
        assertEquals("/path", er3.getPath());

        // Setters
        er3.setCode("C3");
        er3.setMessage("M3");
        er3.setPath("/new");
        LocalDateTime now = LocalDateTime.now();
        er3.setTimestamp(now);
        assertEquals("C3", er3.getCode());
        assertEquals("M3", er3.getMessage());
        assertEquals("/new", er3.getPath());
        assertEquals(now, er3.getTimestamp());
    }
} 