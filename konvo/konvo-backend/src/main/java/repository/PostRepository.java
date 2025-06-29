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

}