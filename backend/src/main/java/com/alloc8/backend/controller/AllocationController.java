package com.alloc8.backend.controller;

import com.alloc8.backend.dto.AllocationResponseDto;
import com.alloc8.backend.entity.Allocation;
import com.alloc8.backend.service.AllocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @PostMapping("/{requestId}")
    public Allocation allocate(@PathVariable Long requestId) {
        return allocationService.allocateRequest(requestId);
    }
    @GetMapping
    public List<AllocationResponseDto> getAllAllocations() {
        return allocationService.getAllAllocations();
    }

    @PostMapping("/process-pending")
    public List<AllocationResponseDto> processPendingRequests() {
        return allocationService.allocatePendingRequests();
    }
}
