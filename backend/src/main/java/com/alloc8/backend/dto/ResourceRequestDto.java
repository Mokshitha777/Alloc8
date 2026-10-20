package com.alloc8.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResourceRequestDto(

        @NotBlank(message = "Resource name is required")
        String name,

        @NotBlank(message = "Resource type is required")
        String type,

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        Integer capacity

) {}
