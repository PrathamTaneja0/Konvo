package service;

import model.User;
import repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsServiceImplementation implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username = email in our case
        User user = userRepository.findByEmail(username);

        // agar user null hai ya Google se login kara tha (normal password login allow nahi)
        if (user == null || user.isLogin_with_google()) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }

        // Abhi authorities empty de rahe hain
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Spring ke apne User class ko return kar rahe hain jisme:
        // username (email), password, authorities hoti hain
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), authorities
        );
    }
}
