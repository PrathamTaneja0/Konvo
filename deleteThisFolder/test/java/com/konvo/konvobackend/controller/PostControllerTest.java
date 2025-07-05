package com.konvo.konvobackend.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.BeforeEach;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.konvo.konvobackend.model.User;
import com.konvo.konvobackend.model.Post;
import com.konvo.konvobackend.repository.UserRepository;
import com.konvo.konvobackend.repository.PostRepository;
import com.konvo.konvobackend.KonvoBackendApplication;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest(classes = KonvoBackendApplication.class)
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class PostControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;

    @BeforeEach
    void clearDb() {
        postRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/posts - success")
    void getPostsSuccess() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("testuser@mail.com");
        user.setPassword("testpass");
        userRepository.saveAndFlush(user);
        Post post = new Post();
        post.setContent("test post");
        post.setUser(user);
        post.setPost(true);
        post.setCreatedAt(java.time.LocalDateTime.now());
        postRepository.saveAndFlush(post);
        mockMvc.perform(get("/api/posts")
                .header("Authorization", "Bearer test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("test post"));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/posts/99999 - error")
    void getPostError() throws Exception {
        mockMvc.perform(get("/api/posts/99999")
                .header("Authorization", "Bearer test"))
                .andExpect(status().isNotFound());
    }
} 