package com.alloc8.backend.controller;

import com.alloc8.backend.dto.ResourceRequestDto;
import com.alloc8.backend.dto.ResourceResponseDto;
import com.alloc8.backend.entity.Resource;
import com.alloc8.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Resource createResource(
            @Valid @RequestBody ResourceRequestDto dto) {
        return resourceService.createResource(dto);
    }

    @GetMapping
    public List<ResourceResponseDto> getAllResources() {
        return resourceService.getAllResourceResponses();
    }
}
