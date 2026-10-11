package service;

import java.util.List;
import java.util.Map;

public interface NewsService {
    List<Map<String, Object>> getTopHeadlines();
} 