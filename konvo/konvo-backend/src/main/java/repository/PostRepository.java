package repository;

import model.Like;
import model.Post;
import model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByIsPostTrueOrderByCreatedAtDesc();

    List<Post> findAllByRepostUserContainsOrUser_IdAndIsPostTrueOrderByCreatedAtDesc(User user, Long postId);

    List<Post> findByLikesContainingOrderByCreatedAtDesc(User user);

    @Query("SELECT p FROM Post p JOIN p.likes l WHERE l.user.id = :userId")
    List<Post> findByLikesUser_Id(@Param("userId") Long userId);

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.repostFor.id = :repostForId AND p.isRepost = true")
    Post findByUserIdAndRepostForId(@Param("userId") Long userId, @Param("repostForId") Long repostForId);

    List<Post> findAllByRepostForId(Long repostForId);

    // F-V1: Get user's own posts (including reposts they made) - 20 most recent
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.isPost = true ORDER BY p.createdAt DESC")
    List<Post> findUserOwnPostsOrderByCreatedAtDesc(@Param("userId") Long userId);

    // Get posts authored by a specific user (including reposts) - for profile viewing
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.isPost = true ORDER BY p.createdAt DESC")
    List<Post> findUserAuthoredPostsOrderByCreatedAtDesc(@Param("userId") Long userId);

    // F-V2: Get specific user's posts (20 most recent) - no follow check needed here
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId AND p.isPost = true ORDER BY p.createdAt DESC")
    List<Post> findUserPostsOrderByCreatedAtDesc(@Param("userId") Long userId);

    // F-V3: Get posts from all followed users (20 most recent)
    @Query("SELECT p FROM Post p WHERE p.user.id IN " +
           "(SELECT f.id FROM User u JOIN u.followings f WHERE u.id = :userId) " +
           "AND p.isPost = true ORDER BY p.createdAt DESC")
    List<Post> findPostsFromFollowedUsersOrderByCreatedAtDesc(@Param("userId") Long userId);

}