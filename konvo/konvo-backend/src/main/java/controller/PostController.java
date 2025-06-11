package controller;

import dto.PostDto;
import dto_mapper.PostDtoMapper;
import exception.PostException;
import exception.UserException;
import java.util.List;
import model.Post;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import request.PostReplyRequest;
import response.ApiResponse;
import service.PostService;
import service.UserService;

@RestController
@RequestMapping("api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<PostDto> createPost(@RequestBody Post req, @RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        Post post = postService.createPost(req, user);
        PostDto postDto = PostDtoMapper.toPostDto(post, user);
        return new ResponseEntity<>(postDto, HttpStatus.CREATED);
    }

    @PostMapping("/reply")
    public ResponseEntity<PostDto> createReply(@RequestBody PostReplyRequest req, @RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        Post post = postService.createdReply(req, user);
        PostDto postDto = PostDtoMapper.toPostDto(post, user);
        return new ResponseEntity<>(postDto, HttpStatus.CREATED);
    }

    @PutMapping("/{postId}/repost")
    public ResponseEntity<PostDto> repost(@PathVariable Long postId, @RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        Post post = postService.repost(postId, user);
        PostDto postDto = PostDtoMapper.toPostDto(post, user);
        return new ResponseEntity<>(postDto, HttpStatus.OK);
    }


    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse> deletePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        postService.deletePostById(postId, user.getId());
        ApiResponse res = new ApiResponse();
        res.setMessage("Post deleted successfully");
        res.setStatus(true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    @GetMapping("/")
    public ResponseEntity<List<PostDto>> getAllPosts(@RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        List<Post> posts = postService.findAllPosts();
        List<PostDto> postDtos = PostDtoMapper.toPostDtos(posts, user);
        return new ResponseEntity<>(postDtos, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getUsersAllPosts(@PathVariable Long userId,
                                                          @RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        User requestedUser = userService.findUserById(userId);
        List<Post> posts = postService.getUserPost(requestedUser);
        List<PostDto> postDtos = PostDtoMapper.toPostDtos(posts, user);
        return new ResponseEntity<>(postDtos, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/likes")
    public ResponseEntity<List<PostDto>> findPostByLikesContainsUsers(@PathVariable Long userId, @RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        User requestedUser = userService.findUserById(userId);
        List<Post> posts = postService.findByLikesContainsUser(requestedUser);
        List<PostDto> postDtos = PostDtoMapper.toPostDtos(posts, user);
        return new ResponseEntity<>(postDtos, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> findPostById(@PathVariable Long postId, @RequestHeader("Authorization") String jwt) throws UserException, PostException {
        User user = userService.findUserProfileByJwt(jwt);
        Post post = postService.findById(postId);
        PostDto postDto = PostDtoMapper.toPostDto(post, user);
        return new ResponseEntity<>(postDto, HttpStatus.OK);
    }
}
