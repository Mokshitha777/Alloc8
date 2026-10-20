package com.alloc8.backend.controller;

import com.alloc8.backend.dto.AllocationRequestDto;
import com.alloc8.backend.dto.AllocationRequestResponseDto;
import com.alloc8.backend.entity.AllocationRequest;
import com.alloc8.backend.service.AllocationRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class AllocationRequestController {

    private final AllocationRequestService requestService;

    public AllocationRequestController(
            AllocationRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public AllocationRequest createRequest(
            @Valid @RequestBody AllocationRequestDto dto) {
        return requestService.createRequest(dto);
    }

    @GetMapping
    public List<AllocationRequestResponseDto> getAllRequests() {
        return requestService.getAllRequestResponses();
    }
}
