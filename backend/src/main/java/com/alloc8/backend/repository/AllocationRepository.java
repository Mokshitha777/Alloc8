package com.alloc8.backend.repository;

import com.alloc8.backend.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    @Query("""
        SELECT COUNT(a) FROM Allocation a
        WHERE a.resource.id = :resourceId
        AND a.request.startTime < :endTime
        AND a.request.endTime > :startTime
        """)
    long countOverlappingAllocations(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}