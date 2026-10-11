package com.konvo.konvobackend;

import dto.PostDto;
import dto_mapper.PostDtoMapper;
import model.Post;
import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PostDtoMapperTest {

    private Post testPost;
    private User testUser;
    private User reqUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("author@example.com");
        testUser.setUsername("author");
        testUser.setFullName("Author User");

        reqUser = new User();
        reqUser.setId(2L);
        reqUser.setEmail("requester@example.com");
        reqUser.setUsername("requester");
        reqUser.setFullName("Requester User");

        testPost = new Post();
        testPost.setId(1L);
        testPost.setContent("Test post content");
        testPost.setUser(testUser);
        testPost.setCreatedAt(LocalDateTime.now());
        testPost.setLikes(new ArrayList<>());
    }

    @Test
    void testToPostDto_Success() {
        PostDto result = PostDtoMapper.toPostDto(testPost, reqUser);
        
        assertNotNull(result);
        assertEquals(testPost.getId(), result.getId());
        assertEquals(testPost.getContent(), result.getContent());
        assertNotNull(result.getUser());
        assertFalse(result.isLiked());
        assertEquals(0, result.getTotalLikes());
    }

    @Test
    void testToPostDto_WithLikes() {
        model.Like like = new model.Like();
        like.setId(1L);
        like.setUser(reqUser);
        like.setPost(testPost);
        
        List<model.Like> likes = new ArrayList<>();
        likes.add(like);
        testPost.setLikes(likes);
        
        PostDto result = PostDtoMapper.toPostDto(testPost, reqUser);
        
        assertNotNull(result);
        assertEquals(1, result.getTotalLikes());
        assertTrue(result.isLiked());
    }

    @Test
    void testToPostDto_UserNotLikedPost() {
        User otherUser = new User();
        otherUser.setId(3L);
        otherUser.setUsername("other");
        
        model.Like like = new model.Like();
        like.setId(1L);
        like.setUser(otherUser);
        like.setPost(testPost);
        
        List<model.Like> likes = new ArrayList<>();
        likes.add(like);
        testPost.setLikes(likes);
        
        PostDto result = PostDtoMapper.toPostDto(testPost, reqUser);
        
        assertNotNull(result);
        assertEquals(1, result.getTotalLikes());
        assertFalse(result.isLiked());
    }

    @Test
    void testToPostDtos_Success() {
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        
        List<PostDto> result = PostDtoMapper.toPostDtos(posts, reqUser);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testPost.getId(), result.get(0).getId());
    }

    @Test
    void testToPostDtos_EmptyList() {
        List<Post> posts = new ArrayList<>();
        
        List<PostDto> result = PostDtoMapper.toPostDtos(posts, reqUser);
        
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testToPostDtos_NullList() {
        assertThrows(NullPointerException.class, () -> {
            PostDtoMapper.toPostDtos(null, reqUser);
        });
    }
} 