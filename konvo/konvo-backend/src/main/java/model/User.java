package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
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
    private String username;
    private String password;
    private String email;
    private String bio;
    private String backgroundImage;
    private boolean req_user;
    private boolean login_with_google;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public boolean isLogin_with_google() {
        return login_with_google;
    }

    @JsonIgnore
    @OneToMany(mappedBy =  "user", cascade = CascadeType.ALL)
    private List<Post> post = new ArrayList<>();

    @OneToMany(mappedBy =  "user", cascade = CascadeType.ALL)
    private List<Like> likes = new ArrayList<>();

    @Embedded
    private Verification verification;

    @JsonIgnore
    @ManyToMany
    private List<User> followers = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    private List<User> followings = new ArrayList<>();

}
