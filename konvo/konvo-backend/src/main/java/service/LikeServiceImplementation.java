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
    public Post likePost(Long postId, User user) throws UserException, PostException {
        Post post = postService.findById(postId);
        // Prevent self-like
        if (post.getUser() != null && user.getId().equals(post.getUser().getId())) {
            throw new PostException("You cannot like your own post.");
        }
        Like isLikeExist = likeRepository.isLikeExist(user.getId(), postId);
        if (isLikeExist != null) {
            // User already liked the post, so unlike it
            likeRepository.deleteById(isLikeExist.getId());
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            Like savedLike = likeRepository.save(like);
            post.getLikes().add(savedLike);
            postRepository.save(post);
        }
        // Always return the full post after like/unlike
        return postService.findById(postId);
    }
    
    @Override
    public List<Like> getAllLikes(Long postId) throws PostException {
        List<Like> likes = likeRepository.findByPostId(postId);
        return likes;
    }

    @Override
    public void unlikePost(Long postId, User user) throws UserException, PostException {
        Like isLikeExist = likeRepository.isLikeExist(user.getId(), postId);
        if (isLikeExist != null) {
            likeRepository.deleteById(isLikeExist.getId());
        }
    }
}