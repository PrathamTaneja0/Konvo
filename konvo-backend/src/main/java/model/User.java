package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;
    private String location;
    private String birthDate;
    private String mobile;
    private String image;
    private String website;

    @Column(unique = true)
    private String username;

    private String password;
    @Column(unique = true)
    private String email;
    private String bio;
    private String backgroundImage;
    private boolean req_user;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    @JsonIgnore
    @OneToMany(mappedBy =  "user", cascade = CascadeType.ALL)
    private List<Post> post = new ArrayList<>();

    @OneToMany(mappedBy =  "user", cascade = CascadeType.ALL)
    private List<Like> likes = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    private List<User> followers = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    private List<User> followings = new ArrayList<>();

}

// Prompt: "How do I implement email verification for user registration?"
// Prompt: "The user entity is causing circular reference issues in JSON serialization. How can I fix this?"
