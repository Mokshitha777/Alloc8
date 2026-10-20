 package com.alloc8.backend.dto;

import java.time.LocalDateTime;

public record AllocationRequestResponseDto(
        Long id,
        Long userId,
        String resourceType,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer priority,
        String status
) {}
