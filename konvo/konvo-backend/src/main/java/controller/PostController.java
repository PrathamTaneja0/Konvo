package controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.PostService;
import service.UserService;

@RestController
@RequestMapping("api/posts")
public class PostController {

    private PostService postService;


    private UserService userService;


}
