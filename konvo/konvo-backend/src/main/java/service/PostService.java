package service;

import exception.PostException;
import exception.UserException;
import model.Post;
import model.User;
import request.PostReplyRequest;

import java.util.List;

public interface PostService {
    
    public Post createPost(Post post, User user) throws UserException, PostException;
    
    public List<Post> findAllPosts() throws PostException;

    public Post repost(Long postId, User user) throws UserException, PostException;

    
    public Post findById(Long id) throws PostException;

    public void deletePostById(Long postId, Long userId) throws PostException, UserException;

    public Post removeFromRepost(Long postId, Long userId) throws PostException, UserException;

    public Post createdReply(PostReplyRequest request, User user) throws PostException;

    public List<Post> findByLikesContainsUser(User user) throws UserException;

    public Post undoRepost(Long postId, User user) throws UserException, PostException;

    // F-V1: Get user's own posts (20 most recent)
    public List<Post> getUserOwnPosts(User user) throws UserException;

    // Get posts authored by a specific user (excluding reposts) - for profile viewing
    public List<Post> getUserAuthoredPosts(User user) throws UserException;

    // F-V2: Get specific followed user's posts (20 most recent)
    public List<Post> getFollowedUserPosts(User currentUser, User targetUser) throws UserException;

    // Get any user's posts (for profile viewing) - more permissive than F-V2
    public List<Post> getUserProfilePosts(User currentUser, User targetUser) throws UserException;

    // F-V3: Get aggregated timeline of all followed users' posts (20 most recent)
    public List<Post> getTimeline(User user) throws UserException;

}