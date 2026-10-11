package dto_mapper;

import dto.PostDto;
import dto.UserDto;
import model.Post;
import model.User;
import util.PostUtil;

import java.util.ArrayList;
import java.util.List;

public class PostDtoMapper {
    public static PostDto toPostDto(Post post, User reqUser) {

        UserDto user = UserDtoMapper.toUserDto(post.getUser());
        boolean isLiked = PostUtil.isLikedByReqUser(reqUser, post);
        boolean isReposted = PostUtil.isRepostedByReqUser(reqUser, post);

        List<Long> repostUserId = new ArrayList<>();
        if (post.getRepostUser() != null) {
            for(User user1 : post.getRepostUser()) {
                repostUserId.add(user1.getId());
            }
        }

        PostDto postDto = new PostDto();
        postDto.setId(post.getId());
        postDto.setCreatedAt(post.getCreatedAt());
        // postDto.setImage(post.getImage()); // Commented out: media attachments not supported
        // postDto.setVideo(post.getVideo()); // Commented out: media attachments not supported
        postDto.setContent(post.getContent());
        postDto.setTotalLikes(post.getLikes() != null ? post.getLikes().size() : 0);
        postDto.setTotalReplies(post.getReplyPosts() != null ? post.getReplyPosts().size() : 0);
        postDto.setTotalRePosts(post.getRepostUser() != null ? post.getRepostUser().size() : 0);
        postDto.setUser(user);
        postDto.setLiked(isLiked);
        postDto.setReposted(isReposted);
        postDto.setRepostUserid(repostUserId);
        postDto.setReplyPosts(toPostDtos(post.getReplyPosts(), reqUser));
        // postDto.setVideo(post.getVideo());
        postDto.setRepost(post.isRepost());
        if (post.getRepostFor() != null) {
            postDto.setRepostFor(toPostDto(post.getRepostFor(), reqUser));
        }

        return postDto;
    }

    public static List<PostDto> toPostDtos(List<Post> posts, User reqUser) {
        List<PostDto> postDtos = new ArrayList<>();
        for (Post post : posts) {
            PostDto postDto = toReplyPostDto(post,reqUser);
            postDtos.add(postDto);
        }
        return postDtos;
    }

    private static PostDto toReplyPostDto(Post post, User reqUser) {

        UserDto user = UserDtoMapper.toUserDto(post.getUser());
        boolean isLiked = PostUtil.isLikedByReqUser(reqUser, post);
        boolean isReposted = PostUtil.isRepostedByReqUser(reqUser, post);

        List<Long> repostUserId = new ArrayList<>();
        if (post.getRepostUser() != null) {
            for(User user1 : post.getRepostUser()) {
                repostUserId.add(user1.getId());
            }
        }

        PostDto postDto = new PostDto();
        postDto.setId(post.getId());
        postDto.setCreatedAt(post.getCreatedAt());
        // postDto.setImage(post.getImage()); // Commented out: media attachments not supported
        // postDto.setVideo(post.getVideo()); // Commented out: media attachments not supported
        postDto.setContent(post.getContent());
        postDto.setTotalLikes(post.getLikes() != null ? post.getLikes().size() : 0);
        postDto.setTotalReplies(post.getReplyPosts() != null ? post.getReplyPosts().size() : 0);
        postDto.setTotalRePosts(post.getRepostUser() != null ? post.getRepostUser().size() : 0);
        postDto.setUser(user);
        postDto.setLiked(isLiked);
        postDto.setReposted(isReposted);
        postDto.setRepostUserid(repostUserId);
        // postDto.setVideo(post.getVideo());


        return postDto;
    }
}
