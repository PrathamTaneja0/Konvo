package com.konvo.konvobackend;

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
import repository.PostRepository;
import service.PostServiceImplementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import request.PostReplyRequest;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @InjectMocks
    private PostServiceImplementation postService;

    @Mock
    private PostRepository postRepository;

    private Post testPost;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");

        testPost = new Post();
        testPost.setId(1L);
        testPost.setContent("Test post content");
        testPost.setUser(testUser);
        testPost.setLikes(new ArrayList<>());
    }

    @Test
    void testCreatePost_Success() throws UserException, PostException {
        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        
        Post newPost = new Post();
        newPost.setContent("New post content");
        
        Post result = postService.createPost(newPost, testUser);
        
        assertNotNull(result);
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void testFindById_Success() throws PostException {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        
        Post result = postService.findById(1L);
        
        assertNotNull(result);
        assertEquals(testPost.getId(), result.getId());
    }

    @Test
    void testFindById_PostNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(PostException.class, () -> {
            postService.findById(1L);
        });
    }

    @Test
    void testFindAllPosts_Success() throws PostException {
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        when(postRepository.findAllByIsPostTrueOrderByCreatedAtDesc()).thenReturn(posts);
        
        List<Post> result = postService.findAllPosts();
        
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void testGetUserOwnPosts_Success() throws UserException {
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        when(postRepository.findUserOwnPostsOrderByCreatedAtDesc(anyLong())).thenReturn(posts);
        
        List<Post> result = postService.getUserOwnPosts(testUser);
        
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void testDeletePostById_Success() throws PostException, UserException {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postRepository.findAllByRepostForId(1L)).thenReturn(new ArrayList<>());
        doNothing().when(postRepository).deleteById(1L);
        
        postService.deletePostById(1L, testUser.getId());
        
        verify(postRepository).deleteById(1L);
    }

    @Test
    void testDeletePostById_PostNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(PostException.class, () -> {
            try {
                postService.deletePostById(1L, testUser.getId());
            } catch (UserException e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Test
    void testCreatedReply_Success() throws PostException {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        
        PostReplyRequest replyRequest = new PostReplyRequest();
        replyRequest.setContent("Reply content");
        replyRequest.setPostId(1L);
        
        Post result = postService.createdReply(replyRequest, testUser);
        
        assertNotNull(result);
        verify(postRepository, times(2)).save(any(Post.class));
    }

    @Test
    void testRepost_Success() throws Exception {
        // Setup repost scenario
        Post originalPost = new Post();
        originalPost.setId(2L);
        originalPost.setUser(testUser);
        originalPost.setContent("Original post");
        originalPost.setRepostUser(new ArrayList<>());
        
        when(postRepository.findById(2L)).thenReturn(Optional.of(originalPost));
        when(postRepository.findByUserIdAndRepostForId(testUser.getId(), 2L)).thenReturn(null);
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> {
            Post savedPost = invocation.getArgument(0);
            if (savedPost.isRepost()) {
                savedPost.setId(3L);
            }
            return savedPost;
        });
        
        Post result = postService.repost(2L, testUser);
        assertNotNull(result);
        // The implementation saves twice: once for the repost, once for updating original post
        verify(postRepository, times(2)).save(any(Post.class));
    }

    @Test
    void testRepost_PostNotFound() {
        when(postRepository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(PostException.class, () -> postService.repost(2L, testUser));
    }

    @Test
    void testUndoRepost_Success() throws Exception {
        Post originalPost = new Post();
        originalPost.setId(3L);
        originalPost.setUser(testUser);
        originalPost.setContent("Original post");
        originalPost.setRepostUser(new ArrayList<>());
        
        Post repost = new Post();
        repost.setId(4L);
        repost.setUser(testUser);
        repost.setRepostFor(originalPost);
        
        when(postRepository.findById(3L)).thenReturn(Optional.of(originalPost));
        when(postRepository.findByUserIdAndRepostForId(testUser.getId(), 3L)).thenReturn(repost);
        when(postRepository.findAllByRepostForId(4L)).thenReturn(new ArrayList<>());
        when(postRepository.save(any(Post.class))).thenReturn(originalPost);
        doNothing().when(postRepository).deleteById(4L);
        
        Post result = postService.undoRepost(3L, testUser);
        
        assertNotNull(result);
        assertEquals(originalPost, result);
        verify(postRepository).deleteById(4L);
        verify(postRepository).save(originalPost);
    }

    @Test
    void testUndoRepost_PostNotFound() {
        when(postRepository.findById(3L)).thenReturn(Optional.empty());
        assertThrows(PostException.class, () -> postService.undoRepost(3L, testUser));
    }

    @Test
    void testGetFollowedUserPosts_Success() throws Exception {
        // Create a target user that the current user follows
        User targetUser = new User();
        targetUser.setId(2L);
        targetUser.setUsername("targetuser");
        
        // Set up following relationship
        testUser.setFollowings(new ArrayList<>());
        testUser.getFollowings().add(targetUser);
        
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        when(postRepository.findUserPostsOrderByCreatedAtDesc(targetUser.getId())).thenReturn(posts);
        
        List<Post> result = postService.getFollowedUserPosts(testUser, targetUser);
        
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void testGetFollowedUserPosts_Empty() throws Exception {
        // Create a target user that the current user follows
        User targetUser = new User();
        targetUser.setId(2L);
        targetUser.setUsername("targetuser");
        
        // Set up following relationship
        testUser.setFollowings(new ArrayList<>());
        testUser.getFollowings().add(targetUser);
        
        when(postRepository.findUserPostsOrderByCreatedAtDesc(targetUser.getId())).thenReturn(new ArrayList<>());
        
        List<Post> result = postService.getFollowedUserPosts(testUser, targetUser);
        
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetUserProfilePosts_Success() throws Exception {
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        when(postRepository.findUserAuthoredPostsOrderByCreatedAtDesc(anyLong())).thenReturn(posts);
        List<Post> result = postService.getUserProfilePosts(testUser, testUser);
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void testGetUserProfilePosts_Empty() throws Exception {
        when(postRepository.findUserAuthoredPostsOrderByCreatedAtDesc(anyLong())).thenReturn(new ArrayList<>());
        List<Post> result = postService.getUserProfilePosts(testUser, testUser);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetUserAuthoredPosts_Success() throws Exception {
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        when(postRepository.findUserAuthoredPostsOrderByCreatedAtDesc(anyLong())).thenReturn(posts);
        List<Post> result = postService.getUserAuthoredPosts(testUser);
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void testGetUserAuthoredPosts_Empty() throws Exception {
        when(postRepository.findUserAuthoredPostsOrderByCreatedAtDesc(anyLong())).thenReturn(new ArrayList<>());
        List<Post> result = postService.getUserAuthoredPosts(testUser);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetTimeline_Success() throws Exception {
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        when(postRepository.findPostsFromFollowedUsersOrderByCreatedAtDesc(anyLong())).thenReturn(posts);
        List<Post> result = postService.getTimeline(testUser);
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void testGetTimeline_Empty() throws Exception {
        when(postRepository.findPostsFromFollowedUsersOrderByCreatedAtDesc(anyLong())).thenReturn(new ArrayList<>());
        List<Post> result = postService.getTimeline(testUser);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testFindByLikesContainsUser_Success() throws Exception {
        List<Post> posts = new ArrayList<>();
        posts.add(testPost);
        when(postRepository.findByLikesUser_Id(anyLong())).thenReturn(posts);
        List<Post> result = postService.findByLikesContainsUser(testUser);
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void testFindByLikesContainsUser_Empty() throws Exception {
        when(postRepository.findByLikesUser_Id(anyLong())).thenReturn(new ArrayList<>());
        List<Post> result = postService.findByLikesContainsUser(testUser);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testRepost_AlreadyReposted_UndoRepost() throws Exception {
        Post originalPost = new Post();
        originalPost.setId(2L);
        originalPost.setUser(testUser);
        originalPost.setContent("Original post");
        originalPost.setRepostUser(new ArrayList<>());
        Post existingRepost = new Post();
        existingRepost.setId(3L);
        existingRepost.setUser(testUser);
        when(postRepository.findById(2L)).thenReturn(Optional.of(originalPost));
        when(postRepository.findByUserIdAndRepostForId(testUser.getId(), 2L)).thenReturn(existingRepost);
        doNothing().when(postRepository).deleteById(existingRepost.getId());
        when(postRepository.save(any(Post.class))).thenReturn(originalPost);
        Post result = postService.repost(2L, testUser);
        assertNotNull(result);
        verify(postRepository).deleteById(existingRepost.getId());
    }

    @Test
    void testDeletePostById_UserNotOwner() {
        Post notOwnedPost = new Post();
        notOwnedPost.setId(1L);
        User otherUser = new User();
        otherUser.setId(2L);
        notOwnedPost.setUser(otherUser);
        when(postRepository.findById(1L)).thenReturn(Optional.of(notOwnedPost));
        assertThrows(UserException.class, () -> postService.deletePostById(1L, testUser.getId()));
    }

    @Test
    void testCreatedReply_AllNullFields() throws PostException {
        PostReplyRequest replyRequest = new PostReplyRequest();
        replyRequest.setPostId(1L);
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        Post result = postService.createdReply(replyRequest, testUser);
        assertNotNull(result);
    }

    @Test
    void testRemoveFromRepost_WithNestedReposts() throws Exception {
        Post originalPost = new Post();
        originalPost.setId(2L);
        Post existingRepost = new Post();
        existingRepost.setId(3L);
        List<Post> nestedReposts = new ArrayList<>();
        Post nested = new Post();
        nested.setId(4L);
        nestedReposts.add(nested);
        when(postRepository.findById(2L)).thenReturn(Optional.of(originalPost));
        when(postRepository.findByUserIdAndRepostForId(1L, 2L)).thenReturn(existingRepost);
        when(postRepository.findAllByRepostForId(3L)).thenReturn(nestedReposts);
        doNothing().when(postRepository).deleteById(4L);
        doNothing().when(postRepository).deleteById(3L);
        when(postRepository.save(any(Post.class))).thenReturn(originalPost);
        Post result = postService.removeFromRepost(2L, 1L);
        assertNotNull(result);
        verify(postRepository).deleteById(4L);
        verify(postRepository).deleteById(3L);
    }

    @Test
    void testGetUserOwnPosts_NullUser() {
        assertThrows(UserException.class, () -> postService.getUserOwnPosts(null));
    }
} 