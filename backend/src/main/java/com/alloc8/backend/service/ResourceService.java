package com.alloc8.backend.service;

import com.alloc8.backend.dto.ResourceRequestDto;
import com.alloc8.backend.dto.ResourceResponseDto;
import com.alloc8.backend.entity.Resource;
import com.alloc8.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public Resource createResource(ResourceRequestDto dto) {
        Resource resource = new Resource();
        resource.setName(dto.name());
        resource.setType(dto.type());
        resource.setCapacity(dto.capacity());
        resource.setStatus("AVAILABLE");

        return resourceRepository.save(resource);
    }
    public List<ResourceResponseDto> getAllResourceResponses() {
        return resourceRepository.findAll()
                .stream()
                .map(resource -> new ResourceResponseDto(
                        resource.getId(),
                        resource.getName(),
                        resource.getType(),
                        resource.getCapacity(),
                        resource.getStatus()
                ))
                .toList();
    }
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }
}