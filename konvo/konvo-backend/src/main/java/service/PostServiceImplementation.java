package service;

import exception.PostException;
import exception.UserException;
import model.Post;
import model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.PostRepository;
import request.PostReplyRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Service
public class PostServiceImplementation implements PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostServiceImplementation.class);

    @Autowired
    private PostRepository postRepository;

    @Override
    public Post createPost(Post req, User user) throws UserException, PostException {
        Post post = new Post();
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setPost(true);
        // post.setImage(req.getImage()); // Commented out: media attachments not supported
        // post.setVideo(req.getVideo()); // Commented out: media attachments not supported
        post.setReply(false);
        post.setContent(req.getContent());

        Post savedPost = postRepository.save(post);
        return savedPost;
    }

    @Override
    public List<Post> findAllPosts() throws PostException {
        return postRepository.findAllByIsPostTrueOrderByCreatedAtDesc();
    }
    
    @Override
    public Post findById(Long id) throws PostException {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Post not found with ID: {}", id);
                    return new PostException("Post not found with id: " + id);
                });
        return post;
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
            if (originalPost.getRepostUser() != null) {
                originalPost.getRepostUser().removeIf(u -> u.getId().equals(user.getId()));
                postRepository.save(originalPost);
            }
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
            // repost.setImage(originalPost.getImage()); // Commented out: media attachments not supported
            // repost.setVideo(originalPost.getVideo()); // Commented out: media attachments not supported
            postRepository.save(repost);
            // Add user to repostUser list
            if (originalPost.getRepostUser() == null) {
                originalPost.setRepostUser(new ArrayList<>());
            }
            if (originalPost.getRepostUser().stream().noneMatch(u -> u.getId().equals(user.getId()))) {
                originalPost.getRepostUser().add(user);
                postRepository.save(originalPost);
            }
            return repost;
        }
    }
    
    @Override
    public Post removeFromRepost(Long postId, Long userId) throws PostException, UserException {
        Post originalPost = findById(postId);
        Post existingRepost = postRepository.findByUserIdAndRepostForId(userId, postId);
        if (existingRepost != null) {
            // Delete all nested reposts of this repost post
            List<Post> nestedReposts = postRepository.findAllByRepostForId(existingRepost.getId());
            for (Post nested : nestedReposts) {
                postRepository.deleteById(nested.getId());
            }
            postRepository.deleteById(existingRepost.getId());
            // Remove user from repostUser list
            if (originalPost.getRepostUser() != null) {
                originalPost.getRepostUser().removeIf(u -> u.getId().equals(userId));
                postRepository.save(originalPost);
            }
        }
        return originalPost;
    }
    
    @Override
    public Post createdReply(PostReplyRequest req, User user) throws PostException {
        Post post = new Post();
        Post replyFor = findById(req.getPostId());
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setPost(false);
        // post.setImage(req.getImage()); // Commented out: media attachments not supported
        post.setReply(true);
        post.setReplyFor(replyFor);
        post.setContent(req.getContent());

        Post savedPost = postRepository.save(post);

        if (replyFor.getReplyPosts() == null) {
            replyFor.setReplyPosts(new ArrayList<>());
        }
        replyFor.getReplyPosts().add(savedPost);
        postRepository.save(replyFor);

        return replyFor;
    }
    
    @Override
    public void deletePostById(Long postId, Long userId) throws PostException, UserException {
        Post post = findById(postId);
        if(!userId.equals(post.getUser().getId())){
            logger.warn("User {} attempted to delete post {} owned by user {}", userId, postId, post.getUser().getId());
            throw new UserException("You are not allowed to delete this post");
        }
        // If this is a repost, update the original post's repostUser list and count
        if (post.isRepost() && post.getRepostFor() != null) {
            Post original = post.getRepostFor();
            if (original.getRepostUser() != null) {
                original.getRepostUser().removeIf(u -> u.getId().equals(post.getUser().getId()));
                postRepository.save(original);
            }
        }
        // Delete all reposts of this post
        List<Post> reposts = postRepository.findAllByRepostForId(postId);
        for (Post repost : reposts) {
            postRepository.deleteById(repost.getId());
        }
        // Delete all replies to this post
        if (post.getReplyPosts() != null) {
            for (Post reply : post.getReplyPosts()) {
                postRepository.deleteById(reply.getId());
            }
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
            if (originalPost.getRepostUser() != null) {
                originalPost.getRepostUser().removeIf(u -> u.getId().equals(user.getId()));
                postRepository.save(originalPost);
            }
        }
        return originalPost;
    }

    // F-V1: Get user's own posts (20 most recent)
    @Override
    public List<Post> getUserOwnPosts(User user) throws UserException {
        if (user == null) {
            logger.error("Attempted to get posts for null user");
            throw new UserException("User not found");
        }
        List<Post> posts = postRepository.findUserOwnPostsOrderByCreatedAtDesc(user.getId());
        // Limit to 20 most recent posts
        return posts.stream().limit(20).toList();
    }

    // Get user's own authored posts (excluding reposts) - for profile
    @Override
    public List<Post> getUserAuthoredPosts(User user) throws UserException {
        if (user == null) {
            throw new UserException("User not found");
        }
        List<Post> posts = postRepository.findUserAuthoredPostsOrderByCreatedAtDesc(user.getId());
        // Limit to 20 most recent posts
        return posts.stream().limit(20).toList();
    }

    // F-V2: Get specific followed user's posts (20 most recent)
    @Override
    public List<Post> getFollowedUserPosts(User currentUser, User targetUser) throws UserException {
        if (currentUser == null || targetUser == null) {
            throw new UserException("User not found");
        }
        
        // Check if current user is following the target user
        boolean isFollowing = currentUser.getFollowings() != null && currentUser.getFollowings().stream()
                .anyMatch(following -> following.getId().equals(targetUser.getId()));
        
        if (!isFollowing) {
            throw new UserException("You are not following this user");
        }
        
        List<Post> posts = postRepository.findUserPostsOrderByCreatedAtDesc(targetUser.getId());
        // Limit to 20 most recent posts
        return posts.stream().limit(20).toList();
    }

    // Get any user's posts (for profile viewing) - more permissive than F-V2
    @Override
    public List<Post> getUserProfilePosts(User currentUser, User targetUser) throws UserException {
        if (currentUser == null || targetUser == null) {
            throw new UserException("User not found");
        }
        
        // For profile viewing, show only authored posts (not reposts)
        List<Post> posts = postRepository.findUserAuthoredPostsOrderByCreatedAtDesc(targetUser.getId());
        // Limit to 20 most recent posts
        return posts.stream().limit(20).toList();
    }

    // F-V3: Get aggregated timeline of all followed users' posts (20 most recent)
    @Override
    public List<Post> getTimeline(User user) throws UserException {
        if (user == null) {
            throw new UserException("User not found");
        }
        
        List<Post> posts = postRepository.findPostsFromFollowedUsersOrderByCreatedAtDesc(user.getId());
        // Limit to 20 most recent posts
        return posts.stream().limit(20).toList();
    }
}

// Prompt: "How do I implement pagination for the post service methods?"
// Prompt: "The post creation is failing with database constraints. How can I debug this?"