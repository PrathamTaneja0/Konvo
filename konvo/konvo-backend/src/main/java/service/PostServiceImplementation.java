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
//        System.out.println(req.getContent());
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setPost(true);
        post.setImage(req.getImage());
        post.setReply(false);
        post.setVideo(req.getVideo());

        post.setContent(req.getContent());

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
        Post originalPost = findById(postId);
        // Check if user already reposted this post
        Post existingRepost = postRepository.findByUserIdAndRepostForId(user.getId(), postId);
        if (existingRepost != null) {
            // Undo repost: delete the repost post
            postRepository.deleteById(existingRepost.getId());
            // Remove user from repostUser list
            originalPost.getRepostUser().removeIf(u -> u.getId().equals(user.getId()));
            postRepository.save(originalPost);
            return originalPost;
        } else {
            // Create a new repost post
            Post repost = new Post();
            repost.setUser(user);
            repost.setCreatedAt(LocalDateTime.now());
            repost.setPost(true);
            repost.setRepost(true);
            repost.setRepostFor(originalPost);
            repost.setContent(originalPost.getContent());
            repost.setImage(originalPost.getImage());
            repost.setVideo(originalPost.getVideo());
            postRepository.save(repost);
            // Add user to repostUser list
            if (originalPost.getRepostUser().stream().noneMatch(u -> u.getId().equals(user.getId()))) {
                originalPost.getRepostUser().add(user);
                postRepository.save(originalPost);
            }
            return repost;
        }
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
        post.setContent(req.getContent());

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
        // If this is a repost, update the original post's repostUser list and count
        if (post.isRepost() && post.getRepostFor() != null) {
            Post original = post.getRepostFor();
            original.getRepostUser().removeIf(u -> u.getId().equals(post.getUser().getId()));
            postRepository.save(original);
        }
        // Delete all reposts of this post
        List<Post> reposts = postRepository.findAllByRepostForId(postId);
        for (Post repost : reposts) {
            postRepository.deleteById(repost.getId());
        }
        // Delete all replies to this post
        for (Post reply : post.getReplyPosts()) {
            postRepository.deleteById(reply.getId());
        }
        postRepository.deleteById(post.getId());
    }
    
    @Override
    public List<Post> findByLikesContainsUser(User user) throws UserException {
        return postRepository.findByLikesUser_Id(user.getId()) ;

    }

    @Override
    public Post undoRepost(Long postId, User user) throws UserException, PostException {
        Post originalPost = findById(postId);
        Post existingRepost = postRepository.findByUserIdAndRepostForId(user.getId(), postId);
        if (existingRepost != null) {
            // Delete all nested reposts of this repost post
            List<Post> nestedReposts = postRepository.findAllByRepostForId(existingRepost.getId());
            for (Post nested : nestedReposts) {
                postRepository.deleteById(nested.getId());
            }
            postRepository.deleteById(existingRepost.getId());
            // Remove user from repostUser list
            originalPost.getRepostUser().removeIf(u -> u.getId().equals(user.getId()));
            postRepository.save(originalPost);
        }
        return originalPost;
    }
}