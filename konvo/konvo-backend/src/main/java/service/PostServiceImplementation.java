package service;

import exception.PostException;
import exception.UserException;
import model.Post;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.PostRepository;
import request.PostReplyRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImplementation implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Override
    public Post createPost(Post req, User user) throws UserException, PostException {
        Post post = new Post();
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setPost(true);
        post.setImage(req.getImage());
        post.setReply(false);
        post.setVideo(req.getVideo());

        return postRepository.save(post);
    }

    @Override
    public List<Post> findAllPosts() throws PostException {
        return postRepository.findAllByIsPostTrueOrderByCreatedAtDesc();
    }
    
    @Override
    public Post findById(Long id) throws PostException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostException("Post not found with id: " + id));
        return post;
    }
    
    @Override
    public List<Post> getUserPost(User user) throws UserException {
        return postRepository.findAllByRepostUserContainsOrUser_IdAndIsPostTrueOrderByCreatedAtDesc(user, user.getId());

    }
    
    @Override
    public Post repost(Long postId, User user) throws UserException, PostException {
        Post post = findById(postId);

        if (post.getRepostUser().contains(user)) {
            post.getRepostUser().remove(user);
        }
        else{
            post.getRepostUser().add(user);
        }

        return postRepository.save(post);
    }
    
    @Override
    public Post removeFromRepost(Long postId, Long userId) throws PostException, UserException {
        //
        return null;
    }
    
    @Override
    public Post createdReply(PostReplyRequest req, User user) throws PostException {
        Post post = new Post();
        Post replyFor = findById(req.getPostId());
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setPost(false);
        post.setImage(req.getImage());
        post.setReply(true);
        post.setReplyFor(replyFor);

        Post savedPost = postRepository.save(post);

        replyFor.getReplyPosts().add(savedPost);
        postRepository.save(replyFor);

        return replyFor;
    }
    
    @Override
    public void deletePostById(Long postId, Long userId) throws PostException, UserException {
        Post post = findById(postId);
        if(!userId.equals(post.getUser().getId())){
            throw new UserException("You are not allowed to delete this post");
        }

        postRepository.deleteById(post.getId());
    }
    
    @Override
    public List<Post> findByLikesContainsUser(User user) throws UserException {
        return postRepository.findByLikesUser_Id(user.getId()) ;

    }
}