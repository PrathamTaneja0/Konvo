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
import com.konvo.konvobackend.repository.UserRepository;
import com.konvo.konvobackend.KonvoBackendApplication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest(classes = KonvoBackendApplication.class)
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void clearDb() {
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser
    @DisplayName("POST /auth/signin - success")
    void loginSuccess() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("testuser@mail.com");
        user.setPassword(passwordEncoder.encode("testpass"));
        userRepository.save(user);
        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"testuser@mail.com\",\"password\":\"testpass\"}"))
                .andExpect(status().isAccepted());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /auth/signin - error")
    void loginError() throws Exception {
        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"wrong\",\"password\":\"wrong\"}"))
                .andExpect(status().is4xxClientError());
    }
} 