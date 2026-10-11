package com.konvo.konvobackend;

import controller.LikeController;
import dto.LikeDto;
import dto.PostDto;
import dto_mapper.LikeDtoMapper;
import dto_mapper.PostDtoMapper;
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
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import service.LikeService;
import service.PostService;
import service.UserService;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LikeControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private LikeService likeService;

    @Mock
    private PostService postService;

    @InjectMocks
    private LikeController likeController;

    private User user;
    private Post post;
    private PostDto postDto;
    private Like like;
    private LikeDto likeDto;
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

        like = new Like();
        like.setId(1L);
        like.setUser(user);
        like.setPost(post);

        likeDto = new LikeDto();
        likeDto.setId(1L);

        jwt = "mock-jwt";
    }

    @Test
    void testLikePost_Success() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(likeService.likePost(1L, user)).thenReturn(post);
        when(postService.findById(1L)).thenReturn(post);

        try (MockedStatic<PostDtoMapper> mocked = mockStatic(PostDtoMapper.class)) {
            mocked.when(() -> PostDtoMapper.toPostDto(any(Post.class), any(User.class))).thenReturn(postDto);
            ResponseEntity<?> response = likeController.likePost(1L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody() instanceof PostDto);
        }
    }

    @Test
    void testLikePost_PostException() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        doThrow(new PostException("Post not found")).when(likeService).likePost(1L, user);

        PostException thrown = assertThrows(PostException.class, () -> {
            likeController.likePost(1L, jwt);
        });
        assertEquals("Post not found", thrown.getMessage());
    }

    @Test
    void testGetAllLikes_Success() throws UserException, PostException {
        List<Like> likes = new ArrayList<>();
        likes.add(like);

        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        when(likeService.getAllLikes(1L)).thenReturn(likes);

        try (MockedStatic<LikeDtoMapper> mocked = mockStatic(LikeDtoMapper.class)) {
            List<LikeDto> likeDtos = new ArrayList<>();
            likeDtos.add(likeDto);
            mocked.when(() -> LikeDtoMapper.toLikeDtos(anyList(), any(User.class))).thenReturn(likeDtos);

            ResponseEntity<List<LikeDto>> response = likeController.getAllLikes(1L, jwt);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertFalse(response.getBody().isEmpty());
        }
    }

    @Test
    void testUnlikePost_Success() throws UserException, PostException {
        when(userService.findUserProfileByJwt(jwt)).thenReturn(user);
        doNothing().when(likeService).unlikePost(1L, user);

        ResponseEntity<?> response = likeController.unlikePost(1L, jwt);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }
} 