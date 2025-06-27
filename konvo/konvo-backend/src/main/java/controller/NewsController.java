package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.NewsService;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    @Autowired
    private NewsService newsService;

    @GetMapping("")
    public ResponseEntity<?> getTopHeadlines() {
        try {
            return ResponseEntity.ok(newsService.getTopHeadlines());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching news: " + e.getMessage());
        }
    }
} 