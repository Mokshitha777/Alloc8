package com.alloc8.backend.service;

import com.alloc8.backend.dto.AllocationRequestDto;
import com.alloc8.backend.dto.AllocationRequestResponseDto;
import com.alloc8.backend.entity.AllocationRequest;
import com.alloc8.backend.entity.AppUser;
import com.alloc8.backend.repository.AllocationRequestRepository;
import com.alloc8.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AllocationRequestService {

    private final AllocationRequestRepository requestRepository;
    private final UserRepository userRepository;

    public AllocationRequestService(
            AllocationRequestRepository requestRepository,
            UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    public AllocationRequest createRequest(AllocationRequestDto dto) {

        if (!dto.endTime().isAfter(dto.startTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time");
        }

        AppUser user = userRepository.findById(dto.userId())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        AllocationRequest request = new AllocationRequest();
        request.setUser(user);
        request.setResourceType(dto.resourceType());
        request.setStartTime(dto.startTime());
        request.setEndTime(dto.endTime());
        request.setPriority(dto.priority());
        request.setStatus("PENDING");

        return requestRepository.save(request);
    }

    public List<AllocationRequest> getAllRequests() {
        return requestRepository.findAll();
    }
    public List<AllocationRequestResponseDto> getAllRequestResponses() {
        return requestRepository.findAll()
                .stream()
                .map(request -> new AllocationRequestResponseDto(
                        request.getId(),
                        request.getUser().getId(),
                        request.getResourceType(),
                        request.getStartTime(),
                        request.getEndTime(),
                        request.getPriority(),
                        request.getStatus()
                ))
                .toList();
    }
}
