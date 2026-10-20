package com.alloc8.backend.dto;

public record UserResponseDto(
        Long id,
        String name,
        String email,
        String role
) {}
