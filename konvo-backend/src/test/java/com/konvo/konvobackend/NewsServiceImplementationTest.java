package com.konvo.konvobackend;

import org.junit.jupiter.api.Test;
import service.NewsServiceImplementation;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class NewsServiceImplementationTest {
    @Test
    void testGetTopHeadlines_ReturnsList() {
        NewsServiceImplementation newsService = new NewsServiceImplementation();
        List<Map<String, Object>> result = newsService.getTopHeadlines();
        assertNotNull(result);
        assertTrue(result instanceof List);
    }
} 