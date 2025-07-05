package com.konvo.konvobackend.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.BeforeEach;
import java.util.UUID;
import com.konvo.konvobackend.model.User;
import com.konvo.konvobackend.repository.UserRepository;
import com.konvo.konvobackend.KonvoBackendApplication;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = KonvoBackendApplication.class)
@AutoConfigureMockMvc
@Transactional
class NewsControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clearDb() {
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/news - success")
    void getNewsSuccess() throws Exception {
        String unique = UUID.randomUUID().toString();
        User user = new User();
        user.setUsername("testuser_" + unique);
        user.setEmail("testuser_" + unique + "@mail.com");
        user.setPassword("testpass");
        userRepository.save(user);
        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/news/99999 - error")
    void getNewsError() throws Exception {
        mockMvc.perform(get("/api/news/99999"))
                .andExpect(status().is4xxClientError());
    }
} 