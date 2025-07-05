package com.konvo.konvobackend;

import exception.PostException;
import exception.UserException;
import model.Like;
import model.Post;
import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import repository.LikeRepository;
import repository.PostRepository;
import service.LikeServiceImplementation;
import service.PostService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LikeServiceImplementationTest {

    @InjectMocks
    private LikeServiceImplementation likeService;

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private PostService postService;

    private User testUser;
    private User postAuthor;
    private Post testPost;
    private Like testLike;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");

        postAuthor = new User();
        postAuthor.setId(2L);
        postAuthor.setEmail("author@example.com");
        postAuthor.setUsername("author");

        testPost = new Post();
        testPost.setId(1L);
        testPost.setContent("Test post content");
        testPost.setUser(postAuthor);
        testPost.setLikes(new ArrayList<>());

        testLike = new Like();
        testLike.setId(1L);
        testLike.setPost(testPost);
        testLike.setUser(testUser);
    }

    @Test
    void testLikePost_Success() throws UserException, PostException {
        when(postService.findById(1L)).thenReturn(testPost);
        when(likeRepository.isLikeExist(1L, 1L)).thenReturn(null);
        when(likeRepository.save(any(Like.class))).thenReturn(testLike);
        when(postRepository.save(any(Post.class))).thenReturn(testPost);

        Post result = likeService.likePost(1L, testUser);

        assertNotNull(result);
        verify(likeRepository).save(any(Like.class));
        verify(postRepository).save(any(Post.class));
        verify(postService, times(2)).findById(1L);
    }

    @Test
    void testLikePost_UnlikeExistingLike() throws UserException, PostException {
        when(postService.findById(1L)).thenReturn(testPost);
        when(likeRepository.isLikeExist(1L, 1L)).thenReturn(testLike);
        doNothing().when(likeRepository).deleteById(1L);

        Post result = likeService.likePost(1L, testUser);

        assertNotNull(result);
        verify(likeRepository).deleteById(1L);
        verify(likeRepository, never()).save(any(Like.class));
        verify(postService, times(2)).findById(1L);
    }

    @Test
    void testLikePost_SelfLikeThrowsException() throws UserException, PostException {
        testPost.setUser(testUser); // Same user as post author

        when(postService.findById(1L)).thenReturn(testPost);

        assertThrows(PostException.class, () -> {
            likeService.likePost(1L, testUser);
        });

        verify(likeRepository, never()).save(any(Like.class));
        verify(likeRepository, never()).deleteById(anyLong());
    }

    @Test
    void testGetAllLikes_Success() throws PostException {
        List<Like> likes = new ArrayList<>();
        likes.add(testLike);
        
        when(postService.findById(1L)).thenReturn(testPost);
        when(likeRepository.findByPostId(1L)).thenReturn(likes);

        List<Like> result = likeService.getAllLikes(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testLike, result.get(0));
    }

    @Test
    void testGetAllLikes_EmptyList() throws PostException {
        when(postService.findById(1L)).thenReturn(testPost);
        when(likeRepository.findByPostId(1L)).thenReturn(new ArrayList<>());

        List<Like> result = likeService.getAllLikes(1L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testUnlikePost_Success() throws UserException, PostException {
        when(postService.findById(1L)).thenReturn(testPost);
        when(likeRepository.isLikeExist(1L, 1L)).thenReturn(testLike);
        doNothing().when(likeRepository).deleteById(1L);

        assertDoesNotThrow(() -> {
            likeService.unlikePost(1L, testUser);
        });

        verify(likeRepository).deleteById(1L);
    }

    @Test
    void testUnlikePost_NoLikeExists() throws UserException, PostException {
        when(postService.findById(1L)).thenReturn(testPost);
        when(likeRepository.isLikeExist(1L, 1L)).thenReturn(null);

        assertDoesNotThrow(() -> {
            likeService.unlikePost(1L, testUser);
        });

        verify(likeRepository, never()).deleteById(anyLong());
    }

    @Test
    void testLikePost_PostNotFound() throws UserException, PostException {
        when(postService.findById(1L)).thenThrow(new PostException("Post not found"));

        assertThrows(PostException.class, () -> {
            likeService.likePost(1L, testUser);
        });
    }

    @Test
    void testGetAllLikes_PostNotFound() throws PostException {
        when(postService.findById(1L)).thenThrow(new PostException("Post not found"));

        assertThrows(PostException.class, () -> {
            likeService.getAllLikes(1L);
        });
    }

    @Test
    void testUnlikePost_PostNotFound() throws UserException, PostException {
        when(postService.findById(1L)).thenThrow(new PostException("Post not found"));

        assertThrows(PostException.class, () -> {
            likeService.unlikePost(1L, testUser);
        });
    }
} 