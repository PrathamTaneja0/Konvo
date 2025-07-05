package com.konvo.konvobackend.service;

import com.konvo.konvobackend.model.Post;
import com.konvo.konvobackend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.konvo.konvobackend.repository.PostRepository;
import com.konvo.konvobackend.request.PostReplyRequest;
import com.konvo.konvobackend.service.PostServiceImplementation;
import com.konvo.konvobackend.exception.PostException;
import com.konvo.konvobackend.exception.UserException;


import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceImplementationTest {
    @Mock
    private PostRepository postRepository;
    @InjectMocks
    private PostServiceImplementation postService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("createPost should save and return post")
    void createPost_success() throws Exception {
        User user = new User();
        Post req = new Post();
        req.setContent("test");
        when(postRepository.save(any(Post.class))).thenReturn(req);
        Post result = postService.createPost(req, user);
        assertEquals("test", result.getContent());
    }

    @Test
    @DisplayName("findAllPosts should return posts")
    void findAllPosts_success() throws PostException {
        when(postRepository.findAllByIsPostTrueOrderByCreatedAtDesc()).thenReturn(Collections.emptyList());
        assertNotNull(postService.findAllPosts());
    }

    @Test
    @DisplayName("findById should return post if exists")
    void findById_success() throws Exception {
        Post post = new Post();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        assertEquals(post, postService.findById(1L));
    }

    @Test
    @DisplayName("findById should throw if post not found")
    void findById_notFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(PostException.class, () -> postService.findById(1L));
    }

    @Test
    @DisplayName("deletePostById should throw if user is not author")
    void deletePostById_notAuthor() {
        Post post = new Post();
        User user = new User();
        user.setId(2L);
        post.setUser(new User());
        post.getUser().setId(1L);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        assertThrows(UserException.class, () -> postService.deletePostById(1L, 2L));
    }

    @Test
    @DisplayName("getUserOwnPosts should throw if user is null")
    void getUserOwnPosts_nullUser() {
        assertThrows(UserException.class, () -> postService.getUserOwnPosts(null));
    }

    @Test
    @DisplayName("getUserAuthoredPosts should throw if user is null")
    void getUserAuthoredPosts_nullUser() {
        assertThrows(UserException.class, () -> postService.getUserAuthoredPosts(null));
    }

    @Test
    @DisplayName("getFollowedUserPosts should throw if not following")
    void getFollowedUserPosts_notFollowing() {
        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setFollowings(new java.util.ArrayList<>());
        User targetUser = new User();
        targetUser.setId(2L);
        assertThrows(UserException.class, () -> postService.getFollowedUserPosts(currentUser, targetUser));
    }

    // Add more tests for repost, createdReply, deletePostById, getUserOwnPosts, etc.
} 