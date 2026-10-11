package model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User user;

    //    private String image; // Commented out: media attachments not supported
    //    private String video; // Commented out: media attachments not supported

    private String content;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "replyFor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> replyPosts = new ArrayList<>();

    @ManyToMany
    private List<User> repostUser = new ArrayList<>();

    @ManyToOne
    private Post replyFor;

    private boolean isReply;
    private boolean isPost;

    private boolean isRepost;

    @ManyToOne
    private Post repostFor;

    private LocalDateTime createdAt;

    public Post() {
    }
}

// Prompt: "The post entity relationships are causing performance issues. How can I optimize this?"
