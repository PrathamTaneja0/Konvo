package service;

import config.JwtProvider;
import exception.UserException;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtProvider jwtProvider;
    
    @Override
    public User findUserById(Long userId) throws UserException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found with id: " + userId));
        return user;
    }
    
    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        String email = jwtProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email);

        
        if (user == null) {
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

        if (followToUser.getFollowers().contains(user) && user.getFollowings().contains(followToUser)) {
            // Unfollow the user
            followToUser.getFollowers().remove(user);
            user.getFollowings().remove(followToUser);
        } else {
            // Follow the user
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
}