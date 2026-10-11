package com.konvo.konvobackend;

import exception.UserException;
import exception.PostException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ExceptionTest {
    @Test
    void testUserExceptionConstructor() {
        UserException ex1 = new UserException("msg");
        assertEquals("msg", ex1.getMessage());
    }

    @Test
    void testPostExceptionConstructor() {
        PostException ex1 = new PostException("msg");
        assertEquals("msg", ex1.getMessage());
    }
} 