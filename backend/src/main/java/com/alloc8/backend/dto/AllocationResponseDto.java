 package com.alloc8.backend.dto;

import java.time.LocalDateTime;

public record AllocationResponseDto(
        Long id,
        Long requestId,
        Long resourceId,
        String resourceName,
        LocalDateTime allocatedAt
) {}
