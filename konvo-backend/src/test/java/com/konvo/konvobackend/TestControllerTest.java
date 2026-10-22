package com.konvo.konvobackend;

import com.kwabenaberko.newsapilib.NewsApiClient;
import com.kwabenaberko.newsapilib.models.Article;
import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import controller.TestController;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TestControllerTest {

    private static NewsApiClient clientAnswering(java.util.function.Consumer<NewsApiClient.ArticlesResponseCallback> answer) {
        NewsApiClient client = mock(NewsApiClient.class);
        doAnswer(invocation -> {
            answer.accept(invocation.getArgument(1));
            return null;
        }).when(client).getEverything(any(), any());
        return client;
    }

    @Test
    void testGetNews_WithoutApiKey_IsDisabled() {
        ResponseEntity<String> response = new TestController("").getNews();
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertTrue(response.getBody().contains("KONVO_NEWS_API_KEY"));
    }

    @Test
    void testGetNews_ReturnsFirstHeadline() {
        Article article = mock(Article.class);
        when(article.getTitle()).thenReturn("Bitcoin hits a new high");
        ArticleResponse articles = mock(ArticleResponse.class);
        when(articles.getArticles()).thenReturn(List.of(article));

        ResponseEntity<String> response = new TestController(clientAnswering(cb -> cb.onSuccess(articles))).getNews();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("News found: Bitcoin hits a new high", response.getBody());
    }

    @Test
    void testGetNews_NoArticles() {
        ArticleResponse empty = mock(ArticleResponse.class);
        when(empty.getArticles()).thenReturn(List.of());
        ResponseEntity<String> response = new TestController(clientAnswering(cb -> cb.onSuccess(empty))).getNews();
        assertEquals("No news articles found", response.getBody());
    }

    @Test
    void testGetNews_ApiFailure_Returns500() {
        ResponseEntity<String> response = new TestController(
            clientAnswering(cb -> cb.onFailure(new RuntimeException("boom")))).getNews();
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
}
