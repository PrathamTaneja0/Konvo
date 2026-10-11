package com.konvo.konvobackend;

import dto.LikeDto;
import dto.PostDto;
import dto.UserDto;
import dto_mapper.LikeDtoMapper;
import dto_mapper.UserDtoMapper;
import dto_mapper.PostDtoMapper;
import model.Like;
import model.Post;
import model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
class LikeDtoMapperTest {

    private User testUser;
    private User reqUser;
    private Post testPost;
    private Like testLike;
    private UserDto userDto;
    private PostDto postDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setPassword("password123");

        reqUser = new User();
        reqUser.setId(2L);
        reqUser.setEmail("req@example.com");
        reqUser.setUsername("requser");
        reqUser.setPassword("password456");

        testPost = new Post();
        testPost.setId(1L);
        testPost.setContent("Test post content");
        testPost.setUser(testUser);

        testLike = new Like();
        testLike.setId(1L);
        testLike.setUser(testUser);
        testLike.setPost(testPost);

        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("test@example.com");
        userDto.setUsername("testuser");

        postDto = new PostDto();
        postDto.setId(1L);
        postDto.setContent("Test post content");
        postDto.setUser(userDto);
    }

    @Test
    void testToLikeDto_Success() {
        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, reqUser)).thenReturn(postDto);

            LikeDto result = LikeDtoMapper.toLikeDto(testLike, reqUser);

            assertNotNull(result);
            assertEquals(1L, result.getId());
            assertNotNull(result.getUser());
            assertNotNull(result.getPost());
            assertEquals(1L, result.getUser().getId());
            assertEquals(1L, result.getPost().getId());
        }
    }

    @Test
    void testToLikeDto_NullLike() {
        assertThrows(NullPointerException.class, () -> {
            LikeDtoMapper.toLikeDto(null, reqUser);
        });
    }

    @Test
    void testToLikeDto_NullReqUser() {
        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(null)).thenReturn(null);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, null)).thenReturn(postDto);

            LikeDto result = LikeDtoMapper.toLikeDto(testLike, null);

            assertNotNull(result);
            assertEquals(1L, result.getId());
            assertNotNull(result.getUser());
            assertNotNull(result.getPost());
        }
    }

    @Test
    void testToLikeDto_NullLikeUser() {
        testLike.setUser(null);

        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(null)).thenReturn(null);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, reqUser)).thenReturn(postDto);

            LikeDto result = LikeDtoMapper.toLikeDto(testLike, reqUser);

            assertNotNull(result);
            assertEquals(1L, result.getId());
            assertNull(result.getUser());
            assertNotNull(result.getPost());
        }
    }

    @Test
    void testToLikeDto_NullLikePost() {
        testLike.setPost(null);

        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(null, reqUser)).thenReturn(null);

            LikeDto result = LikeDtoMapper.toLikeDto(testLike, reqUser);

            assertNotNull(result);
            assertEquals(1L, result.getId());
            assertNotNull(result.getUser());
            assertNull(result.getPost());
        }
    }

    @Test
    void testToLikeDtos_Success() {
        List<Like> likes = new ArrayList<>();
        likes.add(testLike);

        Like like2 = new Like();
        like2.setId(2L);
        like2.setUser(reqUser);
        like2.setPost(testPost);
        likes.add(like2);

        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, reqUser)).thenReturn(postDto);

            List<LikeDto> result = LikeDtoMapper.toLikeDtos(likes, reqUser);

            assertNotNull(result);
            assertEquals(2, result.size());
            assertEquals(1L, result.get(0).getId());
            assertEquals(2L, result.get(1).getId());
            assertNotNull(result.get(0).getUser());
            assertNotNull(result.get(0).getPost());
            assertNotNull(result.get(1).getUser());
            assertNotNull(result.get(1).getPost());
        }
    }

    @Test
    void testToLikeDtos_EmptyList() {
        List<Like> likes = new ArrayList<>();

        List<LikeDto> result = LikeDtoMapper.toLikeDtos(likes, reqUser);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testToLikeDtos_NullList() {
        assertThrows(NullPointerException.class, () -> {
            LikeDtoMapper.toLikeDtos(null, reqUser);
        });
    }

    @Test
    void testToLikeDtos_NullReqUser() {
        List<Like> likes = new ArrayList<>();
        likes.add(testLike);

        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, null)).thenReturn(postDto);

            List<LikeDto> result = LikeDtoMapper.toLikeDtos(likes, null);

            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(1L, result.get(0).getId());
        }
    }

    @Test
    void testToLikeDtos_ListWithNullElements() {
        List<Like> likes = new ArrayList<>();
        likes.add(testLike);
        likes.add(null);

        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, reqUser)).thenReturn(postDto);

            assertThrows(NullPointerException.class, () -> {
                LikeDtoMapper.toLikeDtos(likes, reqUser);
            });
        }
    }

    @Test
    void testToLikeDtos_ListWithNullUserInLike() {
        testLike.setUser(null);
        List<Like> likes = new ArrayList<>();
        likes.add(testLike);

        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(null)).thenReturn(null);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, reqUser)).thenReturn(postDto);

            List<LikeDto> result = LikeDtoMapper.toLikeDtos(likes, reqUser);

            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(1L, result.get(0).getId());
            assertNull(result.get(0).getUser());
        }
    }

    @Test
    void testToLikeDtos_ListWithNullPostInLike() {
        testLike.setPost(null);
        List<Like> likes = new ArrayList<>();
        likes.add(testLike);

        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(null, reqUser)).thenReturn(null);

            List<LikeDto> result = LikeDtoMapper.toLikeDtos(likes, reqUser);

            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(1L, result.get(0).getId());
            assertNull(result.get(0).getPost());
        }
    }

    @Test
    void testToLikeDto_VerifyMapperCalls() {
        try (MockedStatic<UserDtoMapper> userDtoMapperMock = mockStatic(UserDtoMapper.class);
             MockedStatic<PostDtoMapper> postDtoMapperMock = mockStatic(PostDtoMapper.class)) {

            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(testUser)).thenReturn(userDto);
            userDtoMapperMock.when(() -> UserDtoMapper.toUserDto(reqUser)).thenReturn(userDto);
            postDtoMapperMock.when(() -> PostDtoMapper.toPostDto(testPost, reqUser)).thenReturn(postDto);

            LikeDtoMapper.toLikeDto(testLike, reqUser);

            userDtoMapperMock.verify(() -> UserDtoMapper.toUserDto(testUser));
            postDtoMapperMock.verify(() -> PostDtoMapper.toPostDto(testPost, reqUser));
        }
    }
} 