package repository;

import model.Like;
import model.Post;
import model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByIsPostTureOrderByCreatedAtDesc();

    List<Post> findAllByRepostUserContainsOrUser_IdAndIsPostTrueOrderByCreatedAtDesc(User user, Long postId);

    List<Post> findByLikesContainingOrderByCreatedAtDesc(User user);

    @Query("SELECT p FROM Post p JOIN p.likes l WHERE l.user.id = :userId")
    List<Post> findByLikesUser_Id(Long id);

}