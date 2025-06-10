package service;

import exception.PostException;
import exception.UserException;
import model.Like;
import model.Post;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.LikeRepository;
import repository.PostRepository;

import java.util.List;

@Service
public class LikeServiceImplementation implements LikeService {

    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private PostService postService;
    
    @Override
    public Like likePost(Long postId, User user) throws UserException, PostException {
        Post post = postService.findById(postId);
        
        Like isLikeExist = likeRepository.isLikeExist(user.getId(), postId);
        
        if (isLikeExist != null) {
            // User already liked the po
            likeRepository.deleteById(isLikeExist.getId());
            return isLikeExist;
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            
            Like savedLike = likeRepository.save(like);
            
            post.getLikes().add(savedLike);
            postRepository.save(post);
            
            return savedLike;
        }
    }
    
    @Override
    public List<Like> getAllLikes(Long postId) throws PostException {

        Post post = postService.findById(postId);
        List<Like> likes = likeRepository.findByPostId(postId);
        return likes;
    }
}