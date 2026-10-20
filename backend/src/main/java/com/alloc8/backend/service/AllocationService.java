
package com.alloc8.backend.service;

import com.alloc8.backend.dto.AllocationResponseDto;
import com.alloc8.backend.entity.Allocation;
import com.alloc8.backend.entity.AllocationRequest;
import com.alloc8.backend.entity.Resource;
import com.alloc8.backend.exception.ResourceUnavailableException;
import com.alloc8.backend.repository.AllocationRepository;
import com.alloc8.backend.repository.AllocationRequestRepository;
import com.alloc8.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AllocationService {

    private final AllocationRepository allocationRepository;
    private final AllocationRequestRepository requestRepository;
    private final ResourceRepository resourceRepository;

    public AllocationService(
            AllocationRepository allocationRepository,
            AllocationRequestRepository requestRepository,
            ResourceRepository resourceRepository) {
        this.allocationRepository = allocationRepository;
        this.requestRepository = requestRepository;
        this.resourceRepository = resourceRepository;
    }

    @Transactional
    public Allocation allocateRequest(Long requestId) {

        AllocationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalStateException(
                    "Request is not pending. Current status: "
                            + request.getStatus());
        }

        LocalDateTime start = request.getStartTime();
        LocalDateTime end = request.getEndTime();

        if (start == null || end == null || !end.isAfter(start)) {
            throw new IllegalArgumentException("Invalid time range");
        }

        List<Resource> resources = resourceRepository.findAll();

        for (Resource resource : resources) {

            if (resource.getType() == null ||
                    !resource.getType().equalsIgnoreCase(
                            request.getResourceType())) {
                continue;
            }

            if (!"AVAILABLE".equalsIgnoreCase(resource.getStatus())) {
                continue;
            }

            boolean conflict =
                    allocationRepository.countOverlappingAllocations(
                            resource.getId(), start, end) > 0;

            if (!conflict) {
                Allocation allocation = new Allocation();
                allocation.setRequest(request);
                allocation.setResource(resource);

                request.setStatus("ALLOCATED");
                requestRepository.save(request);

                return allocationRepository.save(allocation);
            }
        }

        throw new ResourceUnavailableException(
                "No suitable resource available for this time slot");
    }

    public List<AllocationResponseDto> getAllAllocations() {
        return allocationRepository.findAll()
                .stream()
                .map(allocation -> new AllocationResponseDto(
                        allocation.getId(),
                        allocation.getRequest().getId(),
                        allocation.getResource().getId(),
                        allocation.getResource().getName(),
                        allocation.getAllocatedAt()
                ))
                .toList();
    }

    @Transactional
    public List<AllocationResponseDto> allocatePendingRequests() {

        List<AllocationRequest> requests =
                requestRepository.findAllByStatusOrderByPriorityDesc("PENDING");

        List<AllocationResponseDto> results = new java.util.ArrayList<>();

        for (AllocationRequest request : requests) {
            try {
                Allocation allocation = allocateRequest(request.getId());

                results.add(new AllocationResponseDto(
                        allocation.getId(),
                        allocation.getRequest().getId(),
                        allocation.getResource().getId(),
                        allocation.getResource().getName(),
                        allocation.getAllocatedAt()
                ));
            } catch (ResourceUnavailableException ex) {
                // Keep the request pending if no resource is available.
            }
        }

        return results;
    }

}
