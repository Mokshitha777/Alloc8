package com.alloc8.backend.controller;

import com.alloc8.backend.dto.RegisterRequestDto;
import com.alloc8.backend.dto.UserResponseDto;
import com.alloc8.backend.entity.AppUser;
import com.alloc8.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }



    @PostMapping("/register")
    public UserResponseDto register(
            @Valid @RequestBody RegisterRequestDto dto) {

        AppUser user = userService.registerUser(dto);

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }


    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers();
    }
}