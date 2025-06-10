package dto_mapper;

import dto.UserDto;
import model.User;
import java.util.ArrayList;
import java.util.List;

public class UserDtoMapper {


    public static UserDto toUserDto(model.User user) {
        UserDto userDto = new UserDto();

        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFullName(user.getFullName());
        userDto.setImage(user.getImage());
        userDto.setBackgroundImage(user.getBackgroundImage());
        userDto.setBio(user.getBio());
        userDto.setBirthDate(user.getBirthDate());
        userDto.setLocation(user.getLocation());
        userDto.setLogin_with_google(user.isLogin_with_google());

//        userDto.set_verified();

//        userDto.setWebsite(user.getWebsite());
//        userDto.setMobile(user.getMobile());
//        userDto.setReq_user(user.isReq_user());

        // Map followers to UserDtos
        userDto.setFollowers(toUserDtos(user.getFollowers()));

        // Map following to UserDtos
        userDto.setFollowing(toUserDtos(user.getFollowings()));

        return userDto;
    }

    public static List<UserDto> toUserDtos(List<User> users) {
        List<UserDto> userDtos = new ArrayList<>();

        for (User user : users) {
            UserDto dto = new UserDto();
            dto.setId(user.getId());
            dto.setEmail(user.getEmail());
            dto.setFullName(user.getFullName());
            dto.setImage(user.getImage());
            // Don't set followers and following for nested users to avoid infinite recursion

            userDtos.add(dto);
        }

        return userDtos;
    }
}
