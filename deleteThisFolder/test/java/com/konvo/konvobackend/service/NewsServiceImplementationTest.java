package com.konvo.konvobackend.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.konvo.konvobackend.service.NewsServiceImplementation;

import java.util.List;
import java.util.Map;
import com.konvo.konvobackend.model.User;

import static org.junit.jupiter.api.Assertions.*;

class NewsServiceImplementationTest {
    @Test
    @DisplayName("getTopHeadlines should return a list (may be empty)")
    void getTopHeadlines_returnsList() {
        NewsServiceImplementation newsService = new NewsServiceImplementation();
        List<Map<String, Object>> headlines = newsService.getTopHeadlines();
        assertNotNull(headlines);
        assertTrue(headlines instanceof List);
    }
} 