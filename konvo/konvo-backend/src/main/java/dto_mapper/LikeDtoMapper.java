package dto_mapper;

import dto.LikeDto;
import dto.PostDto;
import dto.UserDto;
import model.Like;
import model.Post;
import model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class LikeDtoMapper {


    public static LikeDto toLikeDto(Like like, User reqUser) {
        UserDto user = UserDtoMapper.toUserDto(like.getUser());
        UserDto reqUserDto = UserDtoMapper.toUserDto(reqUser);
        PostDto post = PostDtoMapper.toPostDto(like.getPost(), reqUser);

        LikeDto likeDto = new LikeDto();
        likeDto.setId(like.getId());
        likeDto.setPost(post);
        likeDto.setUser(user);

        return likeDto;
    }

    public static List<LikeDto> toLikeDtos(List<Like> likes, User reqUser) {
        List<LikeDto> likeDtos = new ArrayList<>();
        for (Like like : likes) {
            UserDto user = UserDtoMapper.toUserDto(like.getUser());
            PostDto post = PostDtoMapper.toPostDto(like.getPost(), reqUser);
            
            LikeDto likeDto = new LikeDto();
            likeDto.setId(like.getId());    
            likeDto.setUser(user);
            likeDto.setPost(post);
            likeDtos.add(likeDto);
        }
        return likeDtos;
    }
}
