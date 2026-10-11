package controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import config.JwtProvider;
import dto.UserDto;
import dto_mapper.UserDtoMapper;
import exception.UserException;
import model.User;
import repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import response.AuthResponse;
import service.CustomUserDetailsServiceImplementation;
import service.UserService;
import response.ApiResponse;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomUserDetailsServiceImplementation customeUserDetails;

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException{
        String email = user.getEmail();
        String password = user.getPassword();
        String fullName = user.getFullName();
        String birthDate = user.getBirthDate();
        String username = user.getUsername();

        User isEmailExist = userRepository.findByEmail(email);

        if(isEmailExist != null){
            throw new UserException("Email is already used with another account");
        }

        // Validate username
        userService.validateUsername(username);

        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setPassword(passwordEncoder.encode(password));
        createdUser.setBirthDate(birthDate);
        createdUser.setFullName(fullName);
        createdUser.setUsername(username.trim());

        User savedUser = userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        UserDto userDto = UserDtoMapper.toUserDto(savedUser);
        AuthResponse res = new AuthResponse(token, userDto, true);

        return new ResponseEntity<AuthResponse>(res, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signinUserHandler(@RequestBody User user){
        String username = user.getEmail();
        String password = user.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        User userFromDb = userRepository.findByEmail(username);
        UserDto userDto = UserDtoMapper.toUserDto(userFromDb);
        AuthResponse res = new AuthResponse(token, userDto, true);

        return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customeUserDetails.loadUserByUsername(username);

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username");
        }

        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
    }

    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse> checkUsernameAvailability(@RequestParam String username) {
        boolean isAvailable = userService.isUsernameAvailable(username);
        String message = isAvailable ? "Username is available" : "Username is already taken";
        return new ResponseEntity<>(new ApiResponse(message, isAvailable), HttpStatus.OK);
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse> checkEmailAvailability(@RequestParam String email) {
        boolean isAvailable = userRepository.findByEmail(email) == null;
        String message = isAvailable ? "Email is available" : "Email is already registered";
        return new ResponseEntity<>(new ApiResponse(message, isAvailable), HttpStatus.OK);
    }
}

// Prompt: "I'm getting a 403 error on authentication—where could the issue be?"
// Prompt: "The JWT token is not being sent by the frontend. Please check the code I'm providing and tell me where the issue could be"
