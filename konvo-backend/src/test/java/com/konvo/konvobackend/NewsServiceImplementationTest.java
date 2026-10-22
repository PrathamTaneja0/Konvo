package com.konvo.konvobackend;

import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import service.NewsServiceImplementation;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class NewsServiceImplementationTest {

    @Test
    void testWithoutApiKey_ReturnsEmptyListWithoutCallingTheApi() {
        RestTemplate restTemplate = mock(RestTemplate.class);
        NewsServiceImplementation newsService = new NewsServiceImplementation("", restTemplate);
        assertTrue(newsService.getTopHeadlines().isEmpty());
        verifyNoInteractions(restTemplate);
    }

    @Test
    void testDefaultConstructor_WithoutKey_IsDisabled() {
        assertTrue(new NewsServiceImplementation(null).getTopHeadlines().isEmpty());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testWithApiKey_SendsKeyHeaderAndReturnsArticles() {
        RestTemplate restTemplate = mock(RestTemplate.class);
        List<Map<String, Object>> articles = List.of(Map.of("title", "Headline"));
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), any(ParameterizedTypeReference.class)))
            .thenReturn(ResponseEntity.ok(Map.<String, Object>of("articles", articles)));

        NewsServiceImplementation newsService = new NewsServiceImplementation("test-key", restTemplate);
        assertEquals(articles, newsService.getTopHeadlines());
        verify(restTemplate).exchange(anyString(), eq(HttpMethod.GET),
            argThat((HttpEntity<?> e) -> "test-key".equals(e.getHeaders().getFirst("X-Api-Key"))),
            any(ParameterizedTypeReference.class));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testWithApiKey_NoArticles_ReturnsEmptyList() {
        RestTemplate restTemplate = mock(RestTemplate.class);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), any(ParameterizedTypeReference.class)))
            .thenReturn(ResponseEntity.ok(Map.<String, Object>of("status", "ok")));
        assertTrue(new NewsServiceImplementation("test-key", restTemplate).getTopHeadlines().isEmpty());
    }
}
