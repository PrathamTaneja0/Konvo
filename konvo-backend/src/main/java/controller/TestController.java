package controller;

import com.kwabenaberko.newsapilib.NewsApiClient;
import com.kwabenaberko.newsapilib.models.request.EverythingRequest;
import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/test")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);
    private final NewsApiClient newsApiClient;

    @Autowired
    public TestController(@Value("${konvo.news.api-key:}") String apiKey) {
        this(apiKey == null || apiKey.isBlank() ? null : new NewsApiClient(apiKey));
    }

    /** For tests: pass a (mock) client, or null when no API key is configured. */
    public TestController(NewsApiClient newsApiClient) {
        this.newsApiClient = newsApiClient;
    }

    @GetMapping("/news")
    public ResponseEntity<String> getNews() {
        if (newsApiClient == null) {
            return ResponseEntity.status(503).body("News feed disabled: KONVO_NEWS_API_KEY is not set");
        }
        try {
            CompletableFuture<String> future = new CompletableFuture<>();

            // Try using Everything instead of TopHeadlines for testing
            newsApiClient.getEverything(
                new EverythingRequest.Builder()
                    .q("bitcoin")
                    .language("en")
                    .build(),
                new NewsApiClient.ArticlesResponseCallback() {
                    @Override
                    public void onSuccess(ArticleResponse response) {
                        if (response.getArticles() != null && !response.getArticles().isEmpty()) {
                            String firstTitle = response.getArticles().get(0).getTitle();
                            future.complete("News found: " + firstTitle);
                        } else {
                            future.complete("No news articles found");
                        }
                    }

                    @Override
                    public void onFailure(Throwable throwable) {
                        future.completeExceptionally(throwable);
                    }
                }
            );

            // Wait for the async operation to complete
            return ResponseEntity.ok(future.get());
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Failed to fetch news from external API", e);
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return ResponseEntity.status(500).body("Error fetching news");
        }
    }
}

// Prompt: "The async News API call is timing out. How can I fix this?"
// Prompt: "How do I implement proper error handling for external API calls?"
