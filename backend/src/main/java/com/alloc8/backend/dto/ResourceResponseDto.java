
package com.alloc8.backend.dto;

public record ResourceResponseDto(
        Long id,
        String name,
        String type,
        Integer capacity,
        String status
) {}