package service;

import exception.PostException;
import exception.UserException;
import model.Like;
import model.Post;
import model.User;
import java.util.List;

public interface LikeService {
    
    public Post likePost(Long postId, User user) throws UserException, PostException;
    
    public List<Like> getAllLikes(Long postId) throws PostException;
    
    public void unlikePost(Long postId, User user) throws UserException, PostException;
    
}