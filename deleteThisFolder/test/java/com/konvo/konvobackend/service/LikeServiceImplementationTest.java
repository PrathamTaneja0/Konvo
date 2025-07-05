package com.konvo.konvobackend.service;

import com.konvo.konvobackend.model.Like;
import com.konvo.konvobackend.model.Post;
import com.konvo.konvobackend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.konvo.konvobackend.repository.LikeRepository;
import com.konvo.konvobackend.repository.PostRepository;
import com.konvo.konvobackend.repository.UserRepository;
import com.konvo.konvobackend.service.LikeServiceImplementation;
import com.konvo.konvobackend.service.PostService;
import exception.PostException;
import exception.UserException;

import java.util.Optional;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LikeServiceImplementationTest {
    @Mock
    private LikeRepository likeRepository;
    @Mock
    private PostRepository postRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PostService postService;
    @InjectMocks
    private LikeServiceImplementation likeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("likePost should like a post if not already liked")
    void likePost_success() throws Exception {
        User user = new User();
        user.setId(2L);
        User postOwner = new User();
        postOwner.setId(1L);
        Post post = new Post();
        post.setUser(postOwner);
        post.setLikes(new java.util.ArrayList<>());
        when(postService.findById(1L)).thenReturn(post);
        when(likeRepository.isLikeExist(2L, 1L)).thenReturn(null);
        when(likeRepository.save(any(Like.class))).thenReturn(new Like());
        when(postRepository.save(any(Post.class))).thenReturn(post);
        when(postService.findById(1L)).thenReturn(post);
        Post result = likeService.likePost(1L, user);
        assertNotNull(result);
    }

    @Test
    @DisplayName("likePost should throw if post not found")
    void likePost_postNotFound() throws PostException {
        User user = new User();
        user.setId(2L);
        when(postService.findById(1L)).thenReturn(null);
        assertThrows(PostException.class, () -> likeService.likePost(1L, user));
    }

    @Test
    @DisplayName("likePost should throw if user likes own post")
    void likePost_selfLike() throws PostException {
        User user = new User();
        user.setId(1L);
        Post post = new Post();
        post.setUser(user);
        when(postService.findById(1L)).thenReturn(post);
        assertThrows(PostException.class, () -> likeService.likePost(1L, user));
    }

    @Test
    @DisplayName("likePost should unlike if already liked")
    void likePost_alreadyLiked() throws Exception {
        User user = new User();
        user.setId(2L);
        User postOwner = new User();
        postOwner.setId(1L);
        Post post = new Post();
        post.setUser(postOwner);
        post.setLikes(new java.util.ArrayList<>());
        when(postService.findById(1L)).thenReturn(post);
        Like like = new Like();
        like.setId(10L);
        when(likeRepository.isLikeExist(2L, 1L)).thenReturn(like);
        Post result = likeService.likePost(1L, user);
        assertNotNull(result);
        verify(likeRepository).deleteById(10L);
    }

    @Test
    @DisplayName("likePost should like if not already liked")
    void likePost_notLiked() throws Exception {
        User user = new User();
        user.setId(2L);
        User postOwner = new User();
        postOwner.setId(1L);
        Post post = new Post();
        post.setUser(postOwner);
        post.setLikes(new java.util.ArrayList<>());
        when(postService.findById(1L)).thenReturn(post);
        when(likeRepository.isLikeExist(2L, 1L)).thenReturn(null);
        when(likeRepository.save(any(Like.class))).thenReturn(new Like());
        when(postRepository.save(any(Post.class))).thenReturn(post);
        Post result = likeService.likePost(1L, user);
        assertNotNull(result);
        verify(likeRepository).save(any(Like.class));
    }

    @Test
    @DisplayName("getAllLikes should return empty list if post not found")
    void getAllLikes_postNotFound() throws PostException {
        when(postService.findById(1L)).thenReturn(null);
        List<Like> likes = likeService.getAllLikes(1L);
        assertNotNull(likes);
        assertTrue(likes.isEmpty());
    }

    @Test
    @DisplayName("unlikePost should do nothing if like not found")
    void unlikePost_likeNotFound() throws Exception {
        User user = new User();
        user.setId(2L);
        Post post = new Post();
        when(postService.findById(1L)).thenReturn(post);
        when(likeRepository.isLikeExist(2L, 1L)).thenReturn(null);
        likeService.unlikePost(1L, user);
        verify(likeRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("unlikePost should delete if like exists")
    void unlikePost_likeExists() throws Exception {
        User user = new User();
        user.setId(2L);
        Post post = new Post();
        when(postService.findById(1L)).thenReturn(post);
        Like like = new Like();
        like.setId(10L);
        when(likeRepository.isLikeExist(2L, 1L)).thenReturn(like);
        likeService.unlikePost(1L, user);
        verify(likeRepository).deleteById(10L);
    }
} 