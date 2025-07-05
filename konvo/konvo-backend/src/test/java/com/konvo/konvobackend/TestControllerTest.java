package com.konvo.konvobackend;

import controller.TestController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TestControllerTest {

    @InjectMocks
    private TestController testController;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testHello_Success() {
        String response = testController.hello();
        assertEquals("Hello from Konvo Backend!", response);
    }

    @Test
    void testGetNews_Success() {
        ResponseEntity<String> response = testController.getNews();
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains("News found:") || response.getBody().contains("No news articles found"));
    }
} 