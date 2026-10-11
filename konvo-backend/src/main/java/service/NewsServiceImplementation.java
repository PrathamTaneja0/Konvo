package service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;
import org.springframework.core.ParameterizedTypeReference;

@Service
public class NewsServiceImplementation implements NewsService {
    private static final String API_KEY = "52e9f153d4cd42eb9c9e70b1c3fb0774";
    private static final String NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us&language=en&pageSize=5";

    @Override
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getTopHeadlines() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", API_KEY);
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