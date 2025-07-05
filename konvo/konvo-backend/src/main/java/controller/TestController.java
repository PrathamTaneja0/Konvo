package controller;

import com.kwabenaberko.newsapilib.NewsApiClient;
import com.kwabenaberko.newsapilib.models.request.EverythingRequest;
import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Konvo Backend!";
    }

    private final NewsApiClient newsApiClient = new NewsApiClient("52e9f153d4cd42eb9c9e70b1c3fb0774");

    @GetMapping("/news")
    public ResponseEntity<String> getNews() {
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
            return ResponseEntity.status(500).body("Error fetching news: " + e.getMessage());
        }
    }
}
