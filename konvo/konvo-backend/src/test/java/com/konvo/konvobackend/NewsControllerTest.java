package com.konvo.konvobackend;

import controller.NewsController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import service.NewsService;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NewsControllerTest {

    @Mock
    private NewsService newsService;

    @InjectMocks
    private NewsController newsController;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testGetTopHeadlines_Success() {
        List<Map<String, Object>> expectedNews = List.of(Map.of("title", "Test News", "content", "Test content"));
        when(newsService.getTopHeadlines()).thenReturn(expectedNews);

        ResponseEntity<?> response = newsController.getTopHeadlines();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedNews, response.getBody());
    }

    @Test
    void testGetTopHeadlines_Exception() {
        when(newsService.getTopHeadlines()).thenThrow(new RuntimeException("Service error"));

        ResponseEntity<?> response = newsController.getTopHeadlines();
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error fetching news: Service error", response.getBody());
    }
} 