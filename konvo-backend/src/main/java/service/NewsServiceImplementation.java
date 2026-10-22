package service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;
import org.springframework.core.ParameterizedTypeReference;

@Service
public class NewsServiceImplementation implements NewsService {
    private static final Logger logger = LoggerFactory.getLogger(NewsServiceImplementation.class);
    private static final String NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us&language=en&pageSize=5";

    private final String apiKey;
    private final RestTemplate restTemplate;

    @Autowired
    public NewsServiceImplementation(@Value("${konvo.news.api-key:}") String apiKey) {
        this(apiKey, new RestTemplate());
    }

    public NewsServiceImplementation(String apiKey, RestTemplate restTemplate) {
        this.apiKey = apiKey;
        this.restTemplate = restTemplate;
        if (!hasApiKey()) {
            logger.warn("KONVO_NEWS_API_KEY is not set: the news feed is disabled");
        }
    }

    private boolean hasApiKey() {
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getTopHeadlines() {
        if (!hasApiKey()) {
            return Collections.emptyList();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            NEWS_API_URL,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("articles")) {
            return (List<Map<String, Object>>) body.get("articles");
        }
        return Collections.emptyList();
    }
}

// Prompt: "How do I implement caching for the news API to avoid rate limits?"
// Prompt: "The news API is returning empty results. How can I debug this?"
