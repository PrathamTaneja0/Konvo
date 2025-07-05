package service;

import config.JwtProvider;
import exception.UserException;
import model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.UserRepository;

import java.util.List;
import java.util.ArrayList;

@Service
public class UserServiceImplementation implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImplementation.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtProvider jwtProvider;
    
    @Override
    public User findUserById(Long userId) throws UserException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found with ID: {}", userId);
                    return new UserException("User not found with id: " + userId);
                });
        return user;
    }
    
    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        String email = jwtProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            logger.warn("User not found with email: {}", email);
            throw new UserException("User not found with email: " + email);
        }
        
        return user;
    }
    
    @Override
    public User updateUser(Long userId, User req) throws UserException {
        User user = findUserById(userId);

        if (req.getFullName() != null) {
            user.setFullName(req.getFullName());
        }

        if (req.getImage() != null) {
            user.setImage(req.getImage());
        }

        if (req.getBackgroundImage() != null) {
            user.setBackgroundImage(req.getBackgroundImage());
        }

        if (req.getBio() != null) {
            user.setBio(req.getBio());
        }

        if (req.getWebsite() != null) {
            user.setWebsite(req.getWebsite());
        }

        if (req.getBirthDate() != null) {
            user.setBirthDate(req.getBirthDate());
        }

        if (req.getLocation() != null) {
            user.setLocation(req.getLocation());
        }

        if (req.getUsername() != null) {
            user.setUsername(req.getUsername());
        }

        return userRepository.save(user);
    }

    @Override
    public User followUser(Long userId, User user) throws UserException {
        User followToUser = findUserById(userId);

        if (followToUser.getFollowers() != null && followToUser.getFollowers().contains(user) && 
            user.getFollowings() != null && user.getFollowings().contains(followToUser)) {
            // Unfollow the user
            followToUser.getFollowers().remove(user);
            user.getFollowings().remove(followToUser);
        } else {
            // Follow the user
            if (followToUser.getFollowers() == null) {
                followToUser.setFollowers(new ArrayList<>());
            }
            if (user.getFollowings() == null) {
                user.setFollowings(new ArrayList<>());
            }
            followToUser.getFollowers().add(user);
            user.getFollowings().add(followToUser);
        }

        userRepository.save(user);
        userRepository.save(followToUser);
        return followToUser;
    }
    
    @Override
    public List<User> searchUser(String query) {
        return userRepository.searchUser(query);
    }
    
    @Override
    public boolean isUsernameAvailable(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        return userRepository.findByUsername(username.trim()) == null;
    }
    
    @Override
    public void validateUsername(String username) throws UserException {
        if (username == null || username.trim().isEmpty()) {
            throw new UserException("Username is required");
        }
        
        String trimmedUsername = username.trim();
        
        if (trimmedUsername.length() < 3) {
            throw new UserException("Username must be at least 3 characters long");
        }
        
        if (trimmedUsername.length() > 30) {
            throw new UserException("Username must be less than 30 characters");
        }
        
        if (!trimmedUsername.matches("^[a-zA-Z0-9_]+$")) {
            throw new UserException("Username can only contain letters, numbers, and underscores");
        }
        
        if (!isUsernameAvailable(trimmedUsername)) {
            throw new UserException("Username is already taken");
        }
    }
}