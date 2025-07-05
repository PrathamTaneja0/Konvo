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

@SpringBootTest(classes = KonvoBackendApplication.class)
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class LikeControllerTest {
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
    @DisplayName("POST /api/posts/{postId}/like - success")
    void likeSuccess() throws Exception {
        User liker = new User();
        liker.setUsername("liker");
        liker.setEmail("liker@mail.com");
        liker.setPassword("testpass");
        userRepository.saveAndFlush(liker);
        User author = new User();
        author.setUsername("author");
        author.setEmail("author@mail.com");
        author.setPassword("testpass");
        userRepository.saveAndFlush(author);
        Post post = new Post();
        post.setContent("test post");
        post.setUser(author);
        postRepository.saveAndFlush(post);
        mockMvc.perform(post("/api/posts/" + post.getId() + "/like")
                .header("Authorization", "Bearer test"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/posts/99999/like - error")
    void likeError() throws Exception {
        mockMvc.perform(post("/api/posts/99999/like")
                .header("Authorization", "Bearer test"))
                .andExpect(status().is4xxClientError());
    }
} 