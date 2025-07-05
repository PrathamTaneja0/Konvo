package com.konvo.konvobackend.dto;

import dto.PostDto;
import dto_mapper.PostDtoMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import com.konvo.konvobackend.model.User;

class PostDtoMapperTest {
    @Test
    @DisplayName("toPostDto should map Post to PostDto")
    void toPostDto_success() {
        com.konvo.konvobackend.model.Post post = new com.konvo.konvobackend.model.Post();
        post.setId(1L);
        post.setContent("content");
        User user = new User();
        user.setId(2L);
        post.setUser(user); // Set user to avoid NPE
        PostDto dto = PostDtoMapper.toPostDto(post, user);
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("content", dto.getContent());
    }

    @Test
    @DisplayName("toPostDto should handle null post")
    void toPostDto_null() {
        User user = new User();
        user.setId(2L);
        assertThrows(NullPointerException.class, () -> PostDtoMapper.toPostDto(null, user));
    }
} 