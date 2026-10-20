  package com.alloc8.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AllocationRequestDto(

        @NotNull(message = "User ID is required")
        Long userId,

        @NotBlank(message = "Resource type is required")
        String resourceType,

        @NotNull(message = "Start time is required")
        @Future(message = "Start time must be in the future")
        LocalDateTime startTime,

        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        LocalDateTime endTime,

        @NotNull(message = "Priority is required")
        Integer priority

) {}
