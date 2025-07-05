package com.konvo.konvobackend.dto;

import dto.UserDto;
import dto_mapper.UserDtoMapper;
import com.konvo.konvobackend.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserDtoMapperTest {
    @Test
    @DisplayName("toUserDto should map User to UserDto")
    void toUserDto_success() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        UserDto dto = UserDtoMapper.toUserDto(user);
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("testuser", dto.getUsername());
    }

    @Test
    @DisplayName("toUserDto should handle null user")
    void toUserDto_null() {
        assertThrows(NullPointerException.class, () -> UserDtoMapper.toUserDto(null));
    }
} 