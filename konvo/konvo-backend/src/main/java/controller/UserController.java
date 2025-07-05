package controller;

import dto.UserDto;
import dto_mapper.UserDtoMapper;
import exception.UserException;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import response.ApiResponse;
import service.UserService;
import util.UserUtil;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(@RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        UserDto userDto = UserDtoMapper.toUserDto(user);
        userDto.setReq_user(true);
        return new ResponseEntity<>(userDto, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfileByJwt(jwt);
        User user = userService.findUserById(userId);
        UserDto userDto = UserDtoMapper.toUserDto(user);
        userDto.setReq_user(UserUtil.isReqUser(reqUser, user));
        userDto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, user));
        return new ResponseEntity<>(userDto, HttpStatus.ACCEPTED);
    }


    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam("query") String query, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfileByJwt(jwt);
        List<User> users = userService.searchUser(query);
        List<UserDto> userDtos = UserDtoMapper.toUserDtos(users);

        // Set followed and followsYou for each user
        for (int i = 0; i < users.size(); i++) {
            UserDto dto = userDtos.get(i);
            User user = users.get(i);
            dto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, user));
            dto.setFollowsYou(user.getFollowings() != null && user.getFollowings().contains(reqUser));
        }

        return new ResponseEntity<>(userDtos, HttpStatus.ACCEPTED);
    }



    @PutMapping("/update")
    public ResponseEntity<UserDto> updateUser(@RequestBody User req, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfileByJwt(jwt);
        User user = userService.updateUser(reqUser.getId(), req);
        UserDto userDto = UserDtoMapper.toUserDto(user);
        return new ResponseEntity<>(userDto, HttpStatus.ACCEPTED);
    }

    @PutMapping("/{userId}/follow")
    public ResponseEntity<UserDto> followUser(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfileByJwt(jwt);
        User user = userService.followUser(userId, reqUser);
        UserDto userDto = UserDtoMapper.toUserDto(user);


        userDto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, user));

        return new ResponseEntity<>(userDto, HttpStatus.ACCEPTED);
    }









    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<UserDto>> getUserFollowers(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfileByJwt(jwt);
        User user = userService.findUserById(userId);
        List<User> followers = user.getFollowers();
        List<UserDto> followerDtos = UserDtoMapper.toUserDtos(followers);

        // Add information about whether the requesting user follows each follower
        for(UserDto followerDto : followerDtos) {
            for(User follower : followers) {
                if(follower.getId().equals(followerDto.getId())) {
                    boolean isFollowed = follower.getFollowers() != null && follower.getFollowers().contains(reqUser);
                    followerDto.setFollowed(isFollowed);
                    break;
                }
            }
        }

        return new ResponseEntity<>(followerDtos, HttpStatus.OK);
    }

    @GetMapping("/followings/{userId}")
    public ResponseEntity<List<UserDto>> getUserFollowings(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserProfileByJwt(jwt);
        User user = userService.findUserById(userId);
        List<User> followings = user.getFollowings();
        List<UserDto> followingDtos = UserDtoMapper.toUserDtos(followings);

        // Add information about whether the requesting user follows each following
        for(UserDto followingDto : followingDtos) {
            for(User following : followings) {
                if(following.getId().equals(followingDto.getId())) {
                    boolean isFollowed = following.getFollowers() != null && following.getFollowers().contains(reqUser);
                    followingDto.setFollowed(isFollowed);
                    break;
                }
            }
        }

        return new ResponseEntity<>(followingDtos, HttpStatus.OK);
    }
}
