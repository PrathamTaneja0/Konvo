package com.konvo.konvobackend.dto;

import dto.LikeDto;
import dto_mapper.LikeDtoMapper;
import com.konvo.konvobackend.model.Like;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import com.konvo.konvobackend.model.User;
import com.konvo.konvobackend.model.Post;

class LikeDtoMapperTest {
    @Test
    @DisplayName("toLikeDto should map Like to LikeDto")
    void toLikeDto_success() {
        Like like = new Like();
        like.setId(1L);
        User user = new User();
        user.setId(2L);
        like.setUser(user); // Set user to avoid NPE
        Post post = new Post();
        User postUser = new User();
        postUser.setId(3L);
        post.setUser(postUser);
        like.setPost(post); // Set post to avoid NPE
        LikeDto dto = LikeDtoMapper.toLikeDto(like, user);
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
    }

    @Test
    @DisplayName("toLikeDto should handle null like")
    void toLikeDto_null() {
        User user = new User();
        user.setId(2L);
        assertThrows(NullPointerException.class, () -> LikeDtoMapper.toLikeDto(null, user));
    }
} 