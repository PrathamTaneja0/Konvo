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

    public List<Post> getUserPost(User user) throws UserException;

    public List<Post> findByLikesContainsUser(User user) throws UserException;


}