package controller;

import dto.LikeDto;
import dto_mapper.LikeDtoMapper;
import exception.PostException;
import exception.UserException;
import model.Like;

import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import service.LikeService;
import service.PostService;
import service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LikeController {

    @Autowired
    private UserService userService;

    @Autowired
    private LikeService likeService;

    @Autowired
    private PostService postService;

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<LikeDto> likePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String jwt) throws UserException, PostException {

        User user = userService.findUserProfileByJwt(jwt);
        Like like = likeService.likePost(postId, user);

        LikeDto likeDto = LikeDtoMapper.toLikeDto(like, user);

        return new ResponseEntity<>(likeDto, HttpStatus.CREATED);
    }

    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<List<LikeDto>> getAllLikes(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String jwt) throws UserException, PostException {

        User user = userService.findUserProfileByJwt(jwt);
        List<Like> likes = likeService.getAllLikes(postId);

        List<LikeDto> likeDtos = LikeDtoMapper.toLikeDtos(likes, user);

        return new ResponseEntity<>(likeDtos, HttpStatus.OK);
    }

}
