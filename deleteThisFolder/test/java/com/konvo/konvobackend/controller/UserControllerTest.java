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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.konvo.konvobackend.model.User;
import com.konvo.konvobackend.repository.UserRepository;
import com.konvo.konvobackend.KonvoBackendApplication;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = KonvoBackendApplication.class)
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class UserControllerTest {
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
    @DisplayName("GET /api/users/profile - contract check")
    void contractCheck() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("testuser@mail.com");
        user.setPassword("testpass");
        userRepository.save(user);
        mockMvc.perform(get("/api/users/profile")
                .header("Authorization", "Bearer test"))
                .andExpect(status().isAccepted());
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/users/99999 - error")
    void getUserError() throws Exception {
        mockMvc.perform(get("/api/users/99999"))
                .andExpect(status().is4xxClientError());
    }
} 