package com.konvo.konvobackend;

import controller.PostController;
import dto.PostDto;
import exception.PostException;
import exception.UserException;
import model.Post;
import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import request.PostReplyRequest;
import response.ApiResponse;
import service.PostService;
import service.UserService;
import dto_mapper.PostDtoMapper;
import org.mockito.MockedStatic;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostControllerTest {
    @Mock
    private PostService postService;
    @Mock
    private UserService userService;
    @InjectMocks
    private PostController postController;

    private User user;
    private Post post;
    private PostDto postDto;
    private String jwt;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        post = new Post();
        post.setId(1L);
        post.setContent("Test post");
        postDto = new PostDto();
        postDto.setId(1L);
        postDto.setContent("Test post");
        jwt = "mock-jwt";
    }

    @Test
    void testCreatePost_Success() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.createPost(any(Post.class), eq(user))).thenReturn(post);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDto(any(Post.class), any(User.class))).thenReturn(postDto);
            ResponseEntity<PostDto> response = postController.createPost(post, jwt);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(post.getContent(), response.getBody().getContent());
        }
    }

    @Test
    void testCreateReply_Success() throws UserException, PostException {
        PostReplyRequest req = new PostReplyRequest();
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.createdReply(req, user)).thenReturn(post);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDto(any(Post.class), any(User.class))).thenReturn(postDto);
            ResponseEntity<PostDto> response = postController.createReply(req, jwt);
            assertEquals(HttpStatus.CREATED, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(post.getContent(), response.getBody().getContent());
        }
    }

    @Test
    void testRepost_Success() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.repost(1L, user)).thenReturn(post);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDto(any(Post.class), any(User.class))).thenReturn(postDto);
            ResponseEntity<PostDto> response = postController.repost(1L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(post.getContent(), response.getBody().getContent());
        }
    }

    @Test
    void testUndoRepost_Success() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.undoRepost(1L, user)).thenReturn(post);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDto(any(Post.class), any(User.class))).thenReturn(postDto);
            ResponseEntity<PostDto> response = postController.undoRepost(1L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(post.getContent(), response.getBody().getContent());
        }
    }

    @Test
    void testDeletePost_Success() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        doNothing().when(postService).deletePostById(1L, user.getId());
        ResponseEntity<ApiResponse> response = postController.deletePost(1L, jwt);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isStatus());
        assertEquals("Post deleted successfully", response.getBody().getMessage());
    }

    @Test
    void testGetAllPosts_Success() throws UserException, PostException {
        List<Post> posts = new ArrayList<>();
        posts.add(post);
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.findAllPosts()).thenReturn(posts);
        List<PostDto> postDtos = new ArrayList<>();
        postDtos.add(postDto);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDtos(anyList(), any(User.class))).thenReturn(postDtos);
            ResponseEntity<List<PostDto>> response = postController.getAllPosts(jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isEmpty());
        }
    }

    @Test
    void testGetUsersAllPosts_Success() throws UserException, PostException {
        List<Post> posts = new ArrayList<>();
        posts.add(post);
        User requestedUser = new User();
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(userService.findUserById(2L)).thenReturn(requestedUser);
        when(postService.getUserOwnPosts(requestedUser)).thenReturn(posts);
        List<PostDto> postDtos = new ArrayList<>();
        postDtos.add(postDto);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDtos(anyList(), any(User.class))).thenReturn(postDtos);
            ResponseEntity<List<PostDto>> response = postController.getUsersAllPosts(2L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isEmpty());
        }
    }

    @Test
    void testFindPostById_Success() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.findById(1L)).thenReturn(post);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDto(any(Post.class), any(User.class))).thenReturn(postDto);
            ResponseEntity<PostDto> response = postController.findPostById(1L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(post.getContent(), response.getBody().getContent());
        }
    }

    @Test
    void testGetMyPosts_Success() throws UserException, PostException {
        List<Post> posts = new ArrayList<>();
        posts.add(post);
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.getUserOwnPosts(user)).thenReturn(posts);
        List<PostDto> postDtos = new ArrayList<>();
        postDtos.add(postDto);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDtos(anyList(), any(User.class))).thenReturn(postDtos);
            ResponseEntity<List<PostDto>> response = postController.getMyPosts(jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isEmpty());
        }
    }

    @Test
    void testGetMyAuthoredPosts_Success() throws UserException, PostException {
        List<Post> posts = new ArrayList<>();
        posts.add(post);
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.getUserAuthoredPosts(user)).thenReturn(posts);
        List<PostDto> postDtos = new ArrayList<>();
        postDtos.add(postDto);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDtos(anyList(), any(User.class))).thenReturn(postDtos);
            ResponseEntity<List<PostDto>> response = postController.getMyAuthoredPosts(jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isEmpty());
        }
    }

    @Test
    void testGetTimeline_Success() throws UserException, PostException {
        List<Post> posts = new ArrayList<>();
        posts.add(post);
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(postService.getTimeline(user)).thenReturn(posts);
        List<PostDto> postDtos = new ArrayList<>();
        postDtos.add(postDto);
        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDtos(anyList(), any(User.class))).thenReturn(postDtos);
            ResponseEntity<List<PostDto>> response = postController.getTimeline(jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isEmpty());
        }
    }
} 