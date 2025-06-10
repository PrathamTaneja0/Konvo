package dto_mapper;

import dto.PostDto;
import dto.UserDto;
import model.Like;
import model.Post;
import model.User;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PostDtoMapper {
    public static PostDto toPostDto(Post post, User reqUser) {
        PostDto postDto = new PostDto();

        // Set basic post information
        postDto.setId(post.getId());
        postDto.setContent(post.getContent());
        postDto.setImage(post.getImage());
        postDto.setVideo(post.getVideo());
        postDto.setCreatedAt(post.getCreatedAt());

        // Convert User to UserDto
        UserDto userDto = UserDtoMapper.toUserDto(post.getUser());
        postDto.setUser(userDto);

        // Set counts
        postDto.setTotalLikes(post.getLikes().size());
        postDto.setTotalReplies(post.getReplyPosts().size());
        postDto.setTotalRePosts(post.getRepostUser().size());

        // Check if the post is liked by the requesting user
        boolean isLiked = util.PostUtil.isLikedByReqUser(reqUser, post);
        postDto.setLiked(isLiked);

        // Check if the post is reposted by the requesting user
        boolean isReposted = util.PostUtil.isRepostedByReqUser(reqUser, post);
        postDto.setReposted(isReposted);

        // Set repost user IDs
        List<Long> repostUserIds = post.getRepostUser().stream()
                .map(User::getId)
                .collect(Collectors.toList());
        postDto.setRepostUserid(repostUserIds);

        // Set reply posts (if needed)
        // This could lead to recursion, so you might want to handle it differently
        // or limit the depth of recursion

        return postDto;
    }

    private static boolean isLikedByReqUser(User reqUser, Post post) {
        if (reqUser == null || post == null) {
            return false;
        }

        return post.getLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(reqUser.getId()));
    }
}
