package com.konvo.konvobackend;

import config.JwtProvider;
import model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import repository.UserRepository;

import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CsrfProtectionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Test
    void signupWithoutCsrfToken_IsAllowed() throws Exception {
        String body = """
                {"email":"csrf-signup@test.com","password":"secret123","fullName":"Csrf Signup",
                 "birthDate":"2000-01-01","username":"csrf_signup"}
                """;

        mockMvc.perform(post("/auth/signup").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated());
    }

    @Test
    void bearerAuthenticatedWriteWithoutCsrfToken_IsAllowed() throws Exception {
        User user = new User();
        user.setEmail("csrf-bearer@test.com");
        user.setUsername("csrf_bearer");
        user.setPassword("unused");
        userRepository.save(user);
        String jwt = jwtProvider.generateToken(new UsernamePasswordAuthenticationToken(user.getEmail(), null));

        mockMvc.perform(put("/api/users/update")
                        .header("Authorization", "Bearer " + jwt)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"bio\":\"updated\"}"))
                .andExpect(status().isAccepted());
    }

    @Test
    void nonBearerAuthenticatedWrite_StillRequiresCsrfToken() throws Exception {
        // Simulates credentials a browser attaches automatically (session/cookie), which CSRF must still guard
        mockMvc.perform(put("/api/users/update").with(user("csrf-ambient@test.com"))
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/users/update").with(user("csrf-ambient@test.com")).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().is(not(403)));
    }
}
